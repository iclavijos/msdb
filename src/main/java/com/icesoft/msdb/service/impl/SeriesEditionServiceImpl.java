package com.icesoft.msdb.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.*;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.GoogleCalendarService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.repository.jpa.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.DriverCategoryChampionDTO;
import com.icesoft.msdb.service.dto.SessionWinnersDTO;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;
import com.icesoft.msdb.service.dto.SeriesEventsAndWinnersDTO;

@Service
@Transactional
@RequiredArgsConstructor
public class SeriesEditionServiceImpl implements SeriesEditionService {

	private final Logger log = LoggerFactory.getLogger(SeriesEditionServiceImpl.class);

	private final EventEditionRepository eventRepo;
	private final SeriesEditionRepository seriesRepo;
	private final EventSessionRepository sessionRepo;
	private final PointsSystemRepository pointsRepo;
	private final DriverRepository driverRepo;
	private final DriverEventPointsRepository driverPointsRepo;
	private final TeamRepository teamRepo;
	private final TeamEventPointsRepository teamPointsRepo;
	private final ManufacturerEventPointsRepository manufacturerPointsRepo;
	private final StatisticsService statsService;
	private final JDBCRepositoryImpl jdbcRepo;
	private final EventEntryRepository eventEntryRepo;
	private final PointsSystemSessionRepository pssRepo;
	private final SeriesCategoryDriverChampionRepository seriesCategoryDriverChampionRepository;
    private final EventService eventService;
    private final GoogleCalendarService calendarService;

    @Override
    public SeriesEdition createSeriesEdition(SeriesEdition seriesEdition) {
        seriesEdition.setCalendarId(calendarService.createSeriesCalendar(seriesEdition));
        return seriesRepo.save(seriesEdition);
    }

    @Override
    public void deleteSeriesEdition(SeriesEdition seriesEdition) {
        if (StringUtils.isNotEmpty(seriesEdition.getCalendarId())) {
            calendarService.removeSeriesCalendar(seriesEdition);
        }
        seriesRepo.delete(seriesEdition);
    }

    @Override
    public SeriesEdition updateSeriesEdition(SeriesEdition seriesEdition) {
        seriesEdition.setEvents(seriesRepo.findById(seriesEdition.getId()).get().getEvents());
        if (StringUtils.isBlank(seriesEdition.getCalendarId())) {
            seriesEdition.setCalendarId(calendarService.createSeriesCalendar(seriesEdition));
            seriesEdition.getEvents().forEach(event -> {
                calendarService.addEvent(seriesEdition, event, sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(event.getId()));
            });
        }
        calendarService.updateSeriesCalendar(seriesEdition);
        return seriesRepo.save(seriesEdition);
    }

	@Override
	public void addEventToSeries(Long seriesId, Long idEvent, List<EventRacePointsDTO> racesPointsData) {
		SeriesEdition seriesEd = seriesRepo.findById(seriesId)
            .orElseThrow(() -> new MSDBException("Invalid series id " + seriesId));
		EventEdition eventEd;

		racesPointsData.parallelStream().forEach(racePoints -> {
			EventSession session = sessionRepo.findById(racePoints.getRaceId()).get();
			if (!racePoints.isAssigned()) {
				Optional.ofNullable(session.getPointsSystemsSession())
					.map(pss -> pss.removeIf(item -> item.getEventSession().getId().equals(racePoints.getRaceId())));
			} else {
				PointsSystem points = pointsRepo.findById(racePoints.getPSystemAssigned()).get();
				if (session == null || points == null) {
					throw new MSDBException(
							String.format("Provided points for race data invalid [%s, %s]",
									racePoints.getRaceId(),
									racePoints.getPSystemAssigned()));
				}
				PointsSystemSession pss = new PointsSystemSession(points, seriesEd, session);
				pss.setPsMultiplier(racePoints.getPsMultiplier());
				Set<PointsSystemSession> sPss = Optional.ofNullable(session.getPointsSystemsSession()).orElse(new HashSet<>());
				session.getPointsSystemsSession().parallelStream()
					.filter(tmpPss -> tmpPss.getSeriesEdition().getId().equals(seriesId))
					.findFirst().map(sPss::remove);
				sPss.add(pss);
				session.setPointsSystemsSession(sPss);
			}
			sessionRepo.save(session);
		});

		eventEd = eventRepo.findById(idEvent).get();
		seriesEd.addEvent(eventEd);

        if (StringUtils.isEmpty(seriesEd.getCalendarId())) {
            seriesEd.setCalendarId(calendarService.createSeriesCalendar(seriesEd));
        }
        seriesRepo.save(seriesEd);
        calendarService.addEvent(seriesEd, eventEd, sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventEd.getId()));

	}

	@Override
	public void removeEventFromSeries(Long seriesId, Long eventId) {
		EventEdition eventEd = eventRepo.findById(eventId)
            .orElseThrow(() ->new MSDBException("Invalid event edition id " + eventId));

		if (eventEd.getSeriesEditions().stream()
            .noneMatch(se -> se.getId().equals(seriesId))) {
			throw new MSDBException("Provided series id does not match an already assigned one");
		}
		SeriesEdition sEdition = seriesRepo.findById(seriesId).get();
		sEdition.removeEvent(eventEd);
		eventEd.getSeriesEditions().remove(sEdition);
		sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId)
			.forEach(session -> {
                Set<PointsSystemSession> tmp = new HashSet<>();
				if (session.getPointsSystemsSession() != null && !session.getPointsSystemsSession().isEmpty()) {
					for (PointsSystemSession pss : session.getPointsSystemsSession()) {
						if (pss.getSeriesEdition().getId().equals(seriesId)) {
							log.debug("Deleting points system association " + pss);
							pssRepo.delete(pss);
						} else {
							tmp.add(pss);
						}
					}
				}
                session.setPointsSystemsSession(tmp);
                sessionRepo.save(session);
			});

		//We must remove the assigned points, if there were any
        List<EventSession> sessions = sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId);
        sessions
			.forEach(session -> {
				driverPointsRepo.deleteSessionPoints(session.getId(), seriesId);
				teamPointsRepo.deleteSessionPoints(session.getId(), seriesId);
				manufacturerPointsRepo.deleteSessionPoints(session.getId(), seriesId);
			});
		seriesRepo.save(sEdition);
		eventRepo.save(eventEd);
        calendarService.removeEvent(sEdition, eventEd, sessions);
	}

	@Transactional(readOnly=true)
	public List<EventEdition> findSeriesEvents(Long seriesId) {
	    return new ArrayList<>(seriesRepo.findById(seriesId)
            .orElseThrow(() -> new MSDBException("Invalid series edition id " + seriesId))
            .getEvents());
	}

	@Override
	public void setSeriesDriversChampions(Long seriesEditionId, List<DriverCategoryChampionDTO> driverIds) {
		SeriesEdition seriesEd = seriesRepo.findById(seriesEditionId).get();
		List<Driver> currChamps = null; //seriesEd.getDriversChampions();
		List<Driver> newChamps = driverRepo.findByIdIn(
				driverIds.stream().map(DriverCategoryChampionDTO::getDriverId)
					.collect(Collectors.toList()));

		//seriesEd.setDriversChampions(newChamps);
		seriesRepo.save(seriesEd);

		statsService.updateSeriesDriversChampions(seriesEd, currChamps, newChamps,
				seriesEd.getSeries().getName(), seriesEd.getPeriodEnd());

	}

	@Override
	@Transactional(readOnly = true)
	public List<Driver> getSeriesDriversChampions(Long seriesEditionId) {
		return seriesCategoryDriverChampionRepository.getDriversChampions(seriesEditionId);
	}

	@Override
    @Transactional(readOnly = true)
    public List<Driver> getSeriesCategoryDriversChampions(Long seriesEditionId, Long categoryId) {
        return seriesCategoryDriverChampionRepository.getDriversChampionsInCategory(seriesEditionId, categoryId);
    }

	@Override
	public void setSeriesTeamsChampions(Long seriesEditionId, List<Long> teamsIds) {
		SeriesEdition seriesEd = seriesRepo.findById(seriesEditionId)
            .orElseThrow(() ->new MSDBException("Invalid series edition id " + seriesEditionId));
		List<Team> currentChamps = null; //seriesEd.getTeamsChampions();
		List<Team> newChamps = teamRepo.findByIdIn(teamsIds);

		// seriesEd.setTeamsChampions(newChamps);
		seriesRepo.save(seriesEd);

		statsService.updateSeriesTeamsChampions(seriesEd, currentChamps, newChamps,
				seriesEd.getSeries().getName(), seriesEd.getPeriodEnd());
	}

	@Override
	@Transactional(readOnly = true)
	public List<Team> getSeriesTeamsChampions(Long seriesEditionId) {
//		return seriesRepo.findById(seriesEditionId)
//            .orElseThrow(() ->new MSDBException("Invalid series edition id " + seriesEditionId))
//            .getTeamsChampions();
        return Collections.emptyList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<SeriesEventsAndWinnersDTO> getSeriesEditionsEventsAndWinners(Long seriesEditionId) {
		List<EventEdition> events = findSeriesEvents(seriesEditionId);
		return events.parallelStream().map(e -> {
			List<SessionWinnersDTO> winners = new ArrayList<>();

	    	List<Object[]> tmpWinners = jdbcRepo.getEventWinners(e.getId());
	    	List<String> sessions = tmpWinners.stream().map(w -> (String)w[2]).distinct().toList();
	    	for(String session : sessions) {
	    		SessionWinnersDTO catWinners = new SessionWinnersDTO(session);
	    		EventEditionEntry overallWinner = null;
	    		for(Object[] winner : tmpWinners) {
	    			if (winner[2].equals(session)) {
		        		EventEditionEntry entry = eventEntryRepo.findById((Long)winner[0]).get();
		        		catWinners.addWinners((String)winner[1], entry);
		        		if (winner[3].equals(1)) {
		        			overallWinner = entry;
		        		}
	    			}
	        	}
	    		if (catWinners.getNumberOfCategories() > 1) {
	    			catWinners.addWinners("Overall", overallWinner);
	    		}
	    		catWinners.getWinners().sort(SessionWinnersDTO.CategoryWinner::compareTo);
	    		winners.add(catWinners);
	    	}

	    	return new SeriesEventsAndWinnersDTO(e, winners);
		}).sorted(Comparator.comparing(sew -> sew.getEventEdition().getEventDate()))
				.collect(Collectors.toList());
	}

	@Override
	public void cloneSeriesEdition(Long seriesEditionId, String newPeriod) {
		log.debug("Cloning series edition");
		SeriesEdition seriesEd = seriesRepo.findById(seriesEditionId)
            .orElseThrow(() ->  new MSDBException("No series edition with id " + seriesEditionId));

		seriesEd.getEvents().isEmpty();

		SeriesEdition newSeriesEd = new SeriesEdition(seriesEd, newPeriod);
        newSeriesEd.setCalendarId(calendarService.createSeriesCalendar(newSeriesEd));

		final SeriesEdition seriesEdCopy = seriesRepo.save(newSeriesEd);

		seriesEd.getEvents().forEach(ev -> {
            EventEdition newEventEdition = eventService.cloneEventEdition(ev.getId(), newPeriod, Collections.singleton(seriesEdCopy));
            seriesEdCopy.addEvent(newEventEdition);
            seriesRepo.save(seriesEdCopy);
        });

	}

}

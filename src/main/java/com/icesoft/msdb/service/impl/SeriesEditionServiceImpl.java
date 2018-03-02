package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.domain.PointsSystemSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.ManufacturerEventPointsRepository;
import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.PointsSystemSessionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamEventPointsRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.repository.stats.DriverStatisticsRepository;
import com.icesoft.msdb.repository.stats.TeamStatisticsRepository;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.dto.EventEditionWinnersDTO;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;
import com.icesoft.msdb.service.dto.SeriesEventsAndWinnersDTO;

@Service
@Transactional
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
	private final DriverStatisticsRepository driverStatsRepo;
	private final TeamStatisticsRepository teamStatsRepo;
	private final JDBCRepositoryImpl jdbcRepo;
	private final EventEntryRepository eventEntryRepo;
	private final PointsSystemSessionRepository pssRepo;
	
	public SeriesEditionServiceImpl(EventEditionRepository eventRepo, SeriesEditionRepository seriesRepo, 
			EventSessionRepository sessionRepo, PointsSystemRepository pointsRepo, 
			DriverRepository driverRepo, DriverEventPointsRepository driverPointsRepo, TeamRepository teamRepo,
			TeamEventPointsRepository teamPointsRepo, ManufacturerEventPointsRepository manufacturerPointsRepo,
			DriverStatisticsRepository driverStatsRepo,	TeamStatisticsRepository teamStatsRepo, JDBCRepositoryImpl jdbcRepo, 
			EventEntryRepository eventEntryRepo, PointsSystemSessionRepository pssRepository) {
		this.eventRepo = eventRepo;
		this.seriesRepo = seriesRepo;
		this.sessionRepo = sessionRepo;
		this.pointsRepo = pointsRepo;
		this.driverRepo = driverRepo;
		this.driverPointsRepo = driverPointsRepo;
		this.teamRepo = teamRepo;
		this.teamPointsRepo = teamPointsRepo;
		this.manufacturerPointsRepo = manufacturerPointsRepo;
		this.driverStatsRepo = driverStatsRepo;
		this.teamStatsRepo = teamStatsRepo;
		this.jdbcRepo = jdbcRepo;
		this.eventEntryRepo = eventEntryRepo;
		this.pssRepo = pssRepository;
	}

	@Override
	public void addEventToSeries(Long seriesId, Long idEvent, List<EventRacePointsDTO> racesPointsData) {
		SeriesEdition seriesEd = seriesRepo.findOne(seriesId);
		if (seriesEd == null) {
			throw new MSDBException("No series edition found for id '" + seriesId + "'");
		}
		EventEdition eventEd = null;

		racesPointsData.parallelStream().forEach(racePoints -> {
			EventSession session = sessionRepo.findOne(racePoints.getRaceId());
			if (!racePoints.isAssigned()) {
				Optional.ofNullable(session.getPointsSystemsSession())
					.map(pss -> pss.removeIf(item -> item.getEventSession().getId().equals(racePoints.getRaceId())));
			} else {
				PointsSystem points = pointsRepo.findOne(racePoints.getpSystemAssigned());
				if (session == null || points == null) {
					throw new MSDBException(
							String.format("Provided points for race data invalid [%s, %s]", 
									racePoints.getRaceId(), 
									racePoints.getpSystemAssigned()));
				}
				PointsSystemSession pss = new PointsSystemSession(points, seriesEd, session);
				pss.setPsMultiplier(racePoints.getPsMultiplier());
				List<PointsSystemSession> sPss = Optional.ofNullable(session.getPointsSystemsSession()).orElse(new ArrayList<>());
				session.getPointsSystemsSession().parallelStream()
					.filter(tmpPss -> tmpPss.getSeriesEdition().getId().equals(seriesId))
					.findFirst().map(tmp -> sPss.remove(tmp));
				sPss.add(pss);
				session.setPointsSystemsSession(sPss);
			}
			sessionRepo.save(session);
		});
		
		eventEd = eventRepo.findOne(idEvent);
		if (seriesEd.getEvents() != null && !seriesEd.getEvents().isEmpty()) {
			if (!seriesEd.getEvents().contains(eventEd)) {
				seriesEd.getEvents().add(eventEd);
			}
		} else {
			seriesEd.setEvents(new ArrayList<>());
			seriesEd.getEvents().add(eventEd);
		}
		
		seriesRepo.save(seriesEd);
	}

	@Override
	public void removeEventFromSeries(Long seriesId, Long eventId) {
		EventEdition eventEd = eventRepo.findOne(eventId);
		if (eventId == null) {
			throw new MSDBException("No event edition found for id '" + eventId + "'");
		}
		
		if (!eventEd.getSeriesId().contains(seriesId)) {
			throw new MSDBException("Provided series id does not match an already assigned one");
		}
		SeriesEdition sEdition = seriesRepo.findOne(seriesId);
		sEdition.getEvents().remove(eventEd);
		sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId).parallelStream()
			.forEach(session -> {
				if (session.getPointsSystemsSession() != null && !session.getPointsSystemsSession().isEmpty()) {
					List<PointsSystemSession> tmp = new ArrayList<>();
					for (PointsSystemSession pss : session.getPointsSystemsSession()) {
						if (pss.getSeriesEdition().getId().equals(seriesId)) {
							log.debug("Deleting points system association " + pss);
							pssRepo.delete(pss);
						} else {
							tmp.add(pss);
						}
					}
					session.setPointsSystemsSession(tmp);
					sessionRepo.save(session);
				}
			});
		
		//We must remove the assigned points, if there were any
		sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId).stream()
			.forEach(session -> {
				driverPointsRepo.deleteSessionPoints(session.getId(), seriesId);
				teamPointsRepo.deleteSessionPoints(session.getId(), seriesId);
				manufacturerPointsRepo.deleteSessionPoints(session.getId(), seriesId);
			});
	}

	@Transactional(readOnly=true)
	public List<EventEdition> findSeriesEvents(Long seriesId) {
		return eventRepo.findEventsSeriesEdition(seriesId);
	}
	
	@Override
	public void setSeriesDriversChampions(Long seriesEditionId, List<Long> driverIds) {
		SeriesEdition seriesEd = seriesRepo.findOne(seriesEditionId);
		List<Driver> currentChamps = seriesEd.getDriversChampions();
		String categoryName = seriesEd.getSeries().getName();
		String year = seriesEd.getPeriodEnd();
		
		//Update statistics to remove championship won
		for(Driver d: currentChamps) {
			DriverStatistics ds = driverStatsRepo.findOne(d.getId().toString());
			Statistics st = ds.getStaticsForCategory(categoryName);
			st.removeChampionship(seriesEditionId);
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, year);
			st.removeChampionship(seriesEditionId);
			ds.updateStatistics(categoryName, st, year);
			driverStatsRepo.save(ds);
		}
		
		//Update statistics again for new champs
		seriesEd.setDriversChampions(driverRepo.findByIdIn(driverIds));
		for(Driver d: seriesEd.getDriversChampions()) {
			DriverStatistics ds = driverStatsRepo.findOne(d.getId().toString());
			Statistics st = ds.getStaticsForCategory(categoryName);
			st.addChampionship(seriesEd.getEditionName(), year, seriesEditionId);
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, year);
			st.addChampionship(seriesEd.getEditionName(), year, seriesEditionId);
			ds.updateStatistics(categoryName, st, year);
			driverStatsRepo.save(ds);
		}
		
		seriesRepo.save(seriesEd);
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<Driver> getSeriesDriversChampions(Long seriesEditionId) {
		return seriesRepo.findOne(seriesEditionId).getDriversChampions();
	}
	
	@Override
	public void setSeriesTeamsChampions(Long seriesEditionId, List<Long> teamsIds) {
		SeriesEdition seriesEd = seriesRepo.findOne(seriesEditionId);
		List<Team> currentChamps = seriesEd.getTeamsChampions();
		String categoryName = seriesEd.getSeries().getName();
		String year = seriesEd.getPeriodEnd();
		
		//Update statistics to remove championship won
		for(Team d: currentChamps) {
			TeamStatistics ds = teamStatsRepo.findOne(d.getId().toString());
			Statistics st = ds.getStaticsForCategory(categoryName);
			st.removeChampionship(seriesEditionId);
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, year);
			st.removeChampionship(seriesEditionId);
			ds.updateStatistics(categoryName, st, year);
			teamStatsRepo.save(ds);
		}
		
		//Update statistics again for new champs
		seriesEd.setTeamsChampions(teamRepo.findByIdIn(teamsIds));
		for(Team d: seriesEd.getTeamsChampions()) {
			TeamStatistics ds = teamStatsRepo.findOne(d.getId().toString());
			Statistics st = ds.getStaticsForCategory(categoryName);
			st.addChampionship(seriesEd.getEditionName(), year, seriesEditionId);
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, year);
			st.addChampionship(seriesEd.getEditionName(), year, seriesEditionId);
			ds.updateStatistics(categoryName, st, year);
			teamStatsRepo.save(ds);
		}
		
		seriesRepo.save(seriesEd);
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<Team> getSeriesTeamsChampions(Long seriesEditionId) {
		return seriesRepo.findOne(seriesEditionId).getTeamsChampions();
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<SeriesEventsAndWinnersDTO> getSeriesEditionsEventsAndWinners(Long seriesEditionId) {
		List<EventEdition> events = findSeriesEvents(seriesEditionId);
		return events.parallelStream().map(e -> {
			List<EventEditionWinnersDTO> winners = new ArrayList<>();
	    	
	    	List<Object[]> tmpWinners = jdbcRepo.getEventWinners(e.getId());
	    	List<String> sessions = tmpWinners.stream().map(w -> (String)w[2]).distinct().collect(Collectors.toList());
	    	for(String session : sessions) {
	    		EventEditionWinnersDTO catWinners = new EventEditionWinnersDTO(session);
	    		EventEditionEntry overallWinner = null;
	    		for(Object[] winner : tmpWinners) {
	    			if (winner[2].equals(session)) {
		        		EventEditionEntry entry = eventEntryRepo.findOne((Long)winner[0]);
		        		catWinners.addWinners((String)winner[1], entry.getDriversName());
		        		if (winner[3].equals(new Integer(1))) {
		        			overallWinner = entry;
		        		}
	    			}
	        	}
	    		if (catWinners.getNumberOfCategories() > 1) {
	    			catWinners.addWinners("Overall", overallWinner.getDriversName());
	    		}
	    		catWinners.getWinners().sort((w1, w2) -> w1.compareTo(w2));
	    		winners.add(catWinners);
	    	}
	    	
	    	return new SeriesEventsAndWinnersDTO(e, winners);
		}).sorted((sew1, sew2) -> sew1.getEventEditionDate().compareTo(sew2.getEventEditionDate()))
				.collect(Collectors.toList());
	}

}

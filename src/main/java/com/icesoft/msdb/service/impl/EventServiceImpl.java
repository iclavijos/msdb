package com.icesoft.msdb.service.impl;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import com.google.maps.model.Geometry;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.EventEditionRepository;
import com.icesoft.msdb.repository.jpa.EventRepository;
import com.icesoft.msdb.repository.jpa.EventSessionRepository;
import com.icesoft.msdb.repository.jpa.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.service.*;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.repository.search.EventSearchRepository;
import com.icesoft.msdb.service.dto.EditionIdYearDTO;

/**
 * Service Implementation for managing Events.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final EventEditionRepository eventEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final EventSearchRepository eventSearchRepository;
    private final SearchService searchService;
    private final SubscriptionsService subscriptionsService;
    private final EventEditionSearchRepository eventEditionSearchRepository;
    private final RacetrackLayoutRepository racetrackLayoutRepository;
    private final CacheHandler cacheHandler;
    private final CDNService cdnService;
    private final GeoLocationService geoLocationService;

    /**
     * Save a racetrack.
     *
     * @param event the entity to save
     * @return the persisted entity
     */
    @Override
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);
        Event result = eventRepository.save(event);
        eventSearchRepository.deleteById(event.getId());
        eventSearchRepository.save(result);
        return result;
    }

    @Override
    public EventEdition save(EventEdition eventEdition) {
        return save(eventEdition, false);
    }

    @Override
    public EventEdition save(EventEdition eventEdition, boolean update) {
        if (!eventEdition.getEvent().isRally() && !eventEdition.getEvent().isRaid()) {
            RacetrackLayout layout = racetrackLayoutRepository.findById(eventEdition.getTrackLayout().getId()).orElseThrow(
                () -> new MSDBException("Invalid racetrack layout id " + eventEdition.getTrackLayout().getId())
            );
            eventEdition.setTrackLayout(layout);
        } else {
            Geometry geometry = geoLocationService
                .getGeolocationInformation(eventEdition.getLocation());
            eventEdition.setLatitude(geometry.location.lat);
            eventEdition.setLongitude(geometry.location.lng);
            eventEdition.setLocationTimeZone(geoLocationService.getTimeZone(geometry));
        }
        if (eventEdition.getId() != null && !update) {
            throw new BadRequestAlertException("A new eventEdition cannot already have an ID", "eventEdition", "idexists");
        }
        if (eventEdition.getId() == null && update) {
            throw new BadRequestAlertException("Invalid id", "eventEdition", "idnull");
        }

        EventEdition result = eventEditionRepository.save(eventEdition);
        if (eventEdition.getPoster() != null) {
            result.setPosterUrl(updateImage(
                eventEdition.getPoster(),
                null,
                result.getId().toString(),
                "affiche"
            ));
            result = eventEditionRepository.save(result);
        }

        EventEdition searchEntry = new EventEdition();
        searchEntry.setId(result.getId());
        searchEntry.setLongEventName(result.getLongEventName());
        searchEntry.setShortEventName(result.getShortEventName());
        searchEntry.setMultidriver(null);
        eventEditionSearchRepository.save(searchEntry);

        if (result.getSeriesEditions() != null) {
            result.getSeriesEditions().forEach(se -> cacheHandler.resetWinnersCache(se.getId()));
        }

        return result;
    }

    /**
     *  Get all the racetracks.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Event> findAll(String query, Pageable pageable) {
        log.debug("Request to get all Events");
        Page<Event> page;
        if (!StringUtils.isBlank(query)) {
            page = searchService.performWildcardSearch(
                Event.class,
                query.toLowerCase(),
                Arrays.asList("name", "description"), // , "rally", "raid"),
                pageable);
        } else {
            page = eventRepository.findAll(pageable);
        }
        return page;
    }

    /**
     *  Get one racetrack by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Event findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid event id " + id));
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
        eventSearchRepository.deleteById(id);
    }

    @Override
    public Page<Event> search(String query, Pageable pageable) {
        return searchService.performWildcardSearch(Event.class, query, Arrays.asList("name", "description"), pageable);
    }

    @Override
    public Page<EventEdition> findEventEditions(Long idEvent, Pageable pageable) {
    	Page<EventEdition> result = eventEditionRepository.findByEventId(idEvent, pageable);
    	return result;
    }

	@Override
	@Transactional(readOnly=true)
	public List<EditionIdYearDTO> findEventEditionsIdYear(Long idEvent) {
		return eventEditionRepository.findEventEditionsIdYear(idEvent)
				.stream()
				.map(e -> new EditionIdYearDTO((Long)e[0], (Integer)e[1]))
				.collect(Collectors.<EditionIdYearDTO> toList());
	}

	@Override
    @Transactional
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public EventEdition rescheduleEvent(EventEdition event, LocalDate newDate) {
        log.debug("Rescheduling event {}", event.getLongEventName());
        long daysBetween = ChronoUnit.DAYS.between(event.getEventDate(), newDate);
        log.trace("Days between: {}", daysBetween);
        List<EventSession> sessions = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(event.getId());
        sessions.forEach(session -> {
            Long previousStartTime = session.getSessionStartTime().getEpochSecond();
            LocalDateTime time = LocalDateTime.ofInstant(session.getSessionStartTime(), ZoneId.of("UTC"));
            log.trace("Original time for session {}: {}", session.getName(), time);
            time = time.plusDays(daysBetween);
            log.trace("New time: {}", time);
            session.setSessionStartTime(time.toInstant(ZoneOffset.UTC));
            eventSessionRepository.save(session);
            subscriptionsService.saveEventSession(session, previousStartTime);
        });
        event.setEventDate(event.getEventDate().plusDays(daysBetween));
        return event;
    }

    @Override
    public EventEdition cloneEventEdition(Long eventEditionId, String newPeriod, Set<SeriesEdition> series) {
        log.debug("Cloning event edition");
        EventEdition event = eventEditionRepository.findById(eventEditionId)
            .orElseThrow(() ->  new MSDBException("No event edition with id " + eventEditionId));

        EventEdition newEvent = new EventEdition(event);
        newEvent.setId(null);
        newEvent.setPosterUrl(null);
        newEvent.setSeriesEditions(series);
        Integer year;

        try {
            year = Integer.valueOf(newPeriod);
        } catch (NumberFormatException e) {
            year = Integer.valueOf(newPeriod.substring(0, newPeriod.indexOf("-")));
        }
        newEvent.setEditionYear(year);
        newEvent.setEventDate(event.getEventDate().withYear(year));
        newEvent.setLongEventName(year + " " + event.getEvent().getName());
        newEvent.setShortEventName(year + " " + event.getEvent().getName());
        if (newEvent.getShortEventName().length() > 40) {
            newEvent.setShortEventName(newEvent.getShortEventName().substring(0, 40));
        }

        final EventEdition evCopy = eventEditionRepository.save(newEvent);
        eventEditionSearchRepository.save(evCopy);
        final int yearCopy = year;

        eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(event.getId()).stream().forEach(es -> {
            EventSession newSession = EventSession.builder()
                .eventEdition(evCopy)
                .name(es.getName())
                .shortname(es.getShortname())
                .cancelled(Boolean.FALSE)
                .durationType(es.getDurationType())
                .sessionType(es.getSessionType())
                .additionalLap(es.getAdditionalLap())
                .duration(es.getDuration())
                .totalDuration(es.getTotalDuration())
                .maxDuration(es.getMaxDuration())
                .location(es.getLocation())
                .locationTimeZone(es.getLocationTimeZone())
                .build();

            ZonedDateTime zdt = es.getSessionStartTimeDate();
            newSession.setSessionStartTime(zdt.withYear(yearCopy).toInstant());
            final EventSession copy = eventSessionRepository.save(newSession);

            if (!series.isEmpty()) {
                Set<PointsSystemSession> pssL = new HashSet<>();
                es.getPointsSystemsSession().parallelStream().forEach(pss -> {
                    PointsSystemSession tmp = new PointsSystemSession(
                        pss.getPointsSystem(),
                        series.stream().findFirst().get(),
                        copy);
                    tmp.setPsMultiplier(pss.getPsMultiplier());
                    pssL.add(tmp);
                });
                newSession.setPointsSystemsSession(pssL);
            }
            eventSessionRepository.save(newSession);
        });

        return evCopy;
    }

    private String updateImage(byte[] image, String imageUrl, String id, String folder) {
        if (image != null) {
            return cdnService.uploadImage(id, image, folder);
        } else if (imageUrl == null) {
            if (id != null) {
                cdnService.deleteImage(id, folder);
                return null;
            }
        }
        return imageUrl;
    }
}

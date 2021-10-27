package com.icesoft.msdb.service.impl;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.SubscriptionsService;
import org.apache.commons.lang3.SerializationUtils;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventRepository;
import com.icesoft.msdb.repository.search.EventSearchRepository;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.dto.EditionIdYearDTO;

/**
 * Service Implementation for managing Events.
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final EventEditionRepository eventEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final EventSearchRepository eventSearchRepo;
    private final SearchService searchService;
    private final SubscriptionsService subscriptionsService;
    private final EventEditionSearchRepository eventEditionSearchRepository;

    public EventServiceImpl(EventRepository eventRepository,
    			EventEditionRepository eventEditionRepository,
    			EventSearchRepository eventSearchRepo,
                EventSessionRepository eventSessionRepository,
                SearchService searchService,
                SubscriptionsService subscriptionsService,
                EventEditionSearchRepository eventEditionSearchRepository) {
    	this.eventRepository = eventRepository;
    	this.eventEditionRepository = eventEditionRepository;
    	this.eventSearchRepo = eventSearchRepo;
    	this.eventSessionRepository = eventSessionRepository;
    	this.searchService = searchService;
    	this.subscriptionsService = subscriptionsService;
        this.eventEditionSearchRepository = eventEditionSearchRepository;
    }

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
        eventSearchRepo.deleteById(event.getId());
        eventSearchRepo.save(result);
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
    public Page<Event> findAll(Optional<String> query, Pageable pageable) {
        log.debug("Request to get all Events");
        Page<Event> page;
        if (query.isPresent()) {
            page = searchService.performWildcardSearch(eventSearchRepo, query.get().toLowerCase(), new String[]{"name", "description"}, pageable);
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
        eventSearchRepo.deleteById(id);
    }

    @Override
    public Page<Event> search(String query, Pageable pageable) {
    	QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
    			QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
    				.analyzeWildcard(true)
    				.field("name"));

    	return eventSearchRepo.search(queryBuilder, pageable);
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
            Long previousStartTime = session.getSessionStartTime();
            LocalDateTime time = LocalDateTime.ofInstant(Instant.ofEpochSecond(previousStartTime), ZoneId.of("UTC"));
            log.trace("Original time for session {}: {}", session.getName(), time);
            time = time.plusDays(daysBetween);
            log.trace("New time: {}", time);
            session.setSessionStartTime(time.toEpochSecond(ZoneOffset.UTC));
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

        EventEdition newEvent = SerializationUtils.clone(event); // new EventEdition();
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
            EventSession newSession = SerializationUtils.clone(es);
            newSession.setId(null);
            newSession.setEventEdition(evCopy);
            newSession.setPointsSystemsSession(null);

            ZonedDateTime zdt = es.getSessionStartTimeDate();
            newSession.setSessionStartTime(zdt.withYear(yearCopy).toEpochSecond());
            final EventSession copy = eventSessionRepository.save(newSession);

            if (!series.isEmpty()) {
                List<PointsSystemSession> pssL = new ArrayList<>();
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
}

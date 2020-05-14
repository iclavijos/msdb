package com.icesoft.msdb.web.rest;

import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.repository.*;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.EventsSeriesNavigationDTO;
import com.icesoft.msdb.service.dto.SessionCalendarDTO;
import com.icesoft.msdb.service.dto.SessionResultDTO;
import com.icesoft.msdb.service.impl.CacheHandler;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import com.icesoft.msdb.web.rest.views.ResponseViews;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.EventEdition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventEditionResource {

    private final Logger log = LoggerFactory.getLogger(EventEditionResource.class);

    private static final String ENTITY_NAME = "eventEdition";
    private static final String ENTITY_NAME_SESSION = "eventSession";
    private static final String ENTITY_NAME_ENTRY = "eventEntry";
    private static final String ENTITY_NAME_RESULT = "eventEntryResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventEditionRepository eventEditionRepository;
    private final EventEditionSearchRepository eventEditionSearchRepo;
    private final EventSessionRepository eventSessionRepository;
    private final EventEntryRepository eventEntryRepository;
    private final EventEntrySearchRepository eventEntrySearchRepo;
    private final EventEntryResultRepository eventResultRepository;
    private final RacetrackLayoutRepository racetrackLayoutRepo;
    private final ResultsService resultsService;
    private final StatisticsService statsService;
    private final CDNService cdnService;
    private final CacheHandler cacheHandler;
    private final EventService eventService;
    private final SeriesEditionService seriesEditionService;

    public EventEditionResource(EventEditionRepository eventEditionRepository, EventEditionSearchRepository eventEditionSearchRepo,
    		EventEntrySearchRepository eventEntrySearchRepo, EventSessionRepository eventSessionRepository,
    		EventEntryRepository eventEntryRepository, EventEntryResultRepository resultRepository,
    		RacetrackLayoutRepository racetrackLayoutRepo, ResultsService resultsService,
    		CDNService cdnService, StatisticsService statsService, CacheHandler cacheHandler,
            EventService eventService, SeriesEditionService seriesEditionService) {
        this.eventEditionRepository = eventEditionRepository;
        this.eventEditionSearchRepo = eventEditionSearchRepo;
        this.eventSessionRepository = eventSessionRepository;
        this.eventEntryRepository = eventEntryRepository;
        this.eventEntrySearchRepo = eventEntrySearchRepo;
        this.racetrackLayoutRepo = racetrackLayoutRepo;
        this.eventResultRepository = resultRepository;
        this.resultsService = resultsService;
        this.cdnService = cdnService;
        this.statsService = statsService;
        this.cacheHandler = cacheHandler;
        this.eventService = eventService;
        this.seriesEditionService = seriesEditionService;
    }

    /**
     * {@code POST  /event-editions} : Create a new eventEdition.
     *
     * @param eventEdition the eventEdition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventEdition, or with status {@code 400 (Bad Request)} if the eventEdition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<EventEdition> createEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to save EventEdition : {}", eventEdition);
        RacetrackLayout layout = racetrackLayoutRepo.findById(eventEdition.getTrackLayout().getId()).orElseThrow(
            () -> new MSDBException("Invalid racetrack layout id " + eventEdition.getTrackLayout().getId())
        );
        eventEdition.setTrackLayout(layout);
        if (eventEdition.getId() != null) {
            throw new BadRequestAlertException("A new eventEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepo.save(result);
        if (result.getSeriesEditions() != null) {
        	result.getSeriesId().forEach(id -> cacheHandler.resetWinnersCache(id));
        }
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-editions} : Updates an existing eventEdition.
     *
     * @param eventEdition the eventEdition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventEdition,
     * or with status {@code 400 (Bad Request)} if the eventEdition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventEdition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<EventEdition> updateEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to update EventEdition : {}", eventEdition);
        RacetrackLayout layout = racetrackLayoutRepo.findById(eventEdition.getTrackLayout().getId()).orElseThrow(
            () -> new MSDBException("Invalid racetrack layout id " + eventEdition.getTrackLayout().getId())
        );
        eventEdition.setTrackLayout(layout);
        if (eventEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventEdition result = eventEditionRepository.getOne(eventEdition.getId());
        if (result.getSeriesEditions() != null) {
    		eventEdition.setSeriesEditions(result.getSeriesEditions());
    	}
        result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepo.deleteById(result.getId()); //TODO: Temporary fix to avoid duplicity after cloning series edition
        eventEditionSearchRepo.save(result);

        if (result.getSeriesEditions() != null) {
        	result.getSeriesId().stream().forEach(cacheHandler::resetWinnersCache);
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventEdition.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /event-editions/:id} : get the "id" eventEdition.
     *
     * @param id the id of the eventEdition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventEdition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-editions/{id}")
    @Timed
    public ResponseEntity<EventEdition> getEventEdition(@PathVariable Long id) {
        log.debug("REST request to get EventEdition : {}", id);
        Optional<EventEdition> eventEditionOpt = eventEditionRepository.findById(id);
        if (eventEditionOpt.isPresent()) {
            EventEdition eventEdition = eventEditionOpt.get();
        	List<Long> tmp = eventEditionRepository.findNextEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.nextEditionId(tmp.get(0));
        	}
        	tmp = eventEditionRepository.findPreviousEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.previousEditionId(tmp.get(0));
        	}

        }
        return ResponseUtil.wrapOrNotFound(eventEditionOpt);
    }

    /**
     * {@code DELETE  /event-editions/:id} : delete the "id" eventEdition.
     *
     * @param id the id of the eventEdition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-editions/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Transactional
    public ResponseEntity<Void> deleteEventEdition(@PathVariable Long id) {
        log.debug("REST request to delete EventEdition : {}", id);
        EventEdition eventEd = eventEditionRepository.getOne(id);

        if (eventEd.getSeriesEditions() != null) {
            eventEd.getSeriesId().forEach(sId -> {
                seriesEditionService.removeEventFromSeries(sId, id);
                cacheHandler.resetWinnersCache(sId);
            });
        }

        List<EventSession> sessions = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(id);
        sessions.forEach(eventSession -> {
            eventResultRepository.deleteBySession(eventSession);
        });
        eventSessionRepository.deleteInBatch(sessions);
        eventEntryRepository.deleteByEventEdition(eventEd);

        eventEditionRepository.deleteById(id);
        eventEditionSearchRepo.deleteById(id);

        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/prevNextInSeries")
    @Timed
    @Transactional(readOnly=true)
    public List<EventsSeriesNavigationDTO> getPrevNextIdInSeries(@PathVariable Long id) {
    	EventEdition event = eventEditionRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + id)
        );
    	List<EventsSeriesNavigationDTO> result = new ArrayList<>();
    	for(SeriesEdition se: event.getSeriesEditions()) {
//    		int index = se.getEvents().indexOf(event);
//    		EventEdition next = (index < se.getEvents().size() - 1) ? se.getEvents().get(index + 1) : null;
//            EventEdition prev = (index > 0) ? se.getEvents().get(index - 1) : null;
//            result.add(new EventsSeriesNavigationDTO(
//            		Optional.ofNullable(prev).map(ee -> ee.getId()).orElse(null),
//            		Optional.ofNullable(next).map(ee -> ee.getId()).orElse(null),
//            		Optional.ofNullable(prev).map(ee -> ee.getLongEventName()).orElse(null),
//            		Optional.ofNullable(next).map(ee -> ee.getLongEventName()).orElse(null)));
    	}

    	return result;
    }

    /**
     * {@code SEARCH  /_search/event-editions?query=:query} : search for the eventEdition corresponding
     * to the query.
     *
     * @param query the query of the eventEdition search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/event-editions")
    @Timed
    public ResponseEntity<List<EventEdition>> searchEventEditions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of EventEditions for query {}", query);

        QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
    			QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
    				.analyzeWildcard(true)
    				.field("longEventName", 2.0f)
    				.field("shortEventName"));

        Page<EventEdition> page = eventEditionSearchRepo.search(queryBuilder, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/event-editions/{id}/sessions")
    @Timed
    @Transactional(readOnly = true)
    public List<EventSession> getEventEditionSessions(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} sessions", id);
    	List<EventSession> result = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(id);
    	result.parallelStream().forEach(session -> session.setEventEdition(null));
    	return result;
    }

    @GetMapping("/event-editions/{id}/sessions/nonfp")
    @Timed
    public List<EventSession> getEventEditionNonFPSessions(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} sessions", id);
    	List<EventSession> result = eventSessionRepository.findNonFPSessions(id);
    	result.parallelStream().forEach(session -> session.setEventEdition(null));
    	return result;
    }

    @GetMapping("/event-editions/{id}/sessions/races")
    @Timed
    public List<EventSession> getEventEditionRacesSessions(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} races sessions", id);
    	List<EventSession> result = eventSessionRepository.findRacesSessions(id);
    	result.parallelStream().forEach(session -> session.setEventEdition(null));
    	return result;
    }

    @PostMapping("/event-editions/{id}/sessions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public ResponseEntity<EventSession> createEventEditionSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to save EventSession : {}", eventSession);
        if (eventSession.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_SESSION, "idexists", "A new eventSession cannot already have an ID")).body(null);
        }
        EventSession result = eventSessionRepository.save(eventSession);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/sessions"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_SESSION, result.getId().toString()))
            .body(result);
    }

    @GetMapping("/event-editions/event-sessions/{id}")
    @Timed
    public ResponseEntity<EventSession> getEventSession(@PathVariable Long id) {
        log.debug("REST request to get EventSession : {}", id);
        Optional<EventSession> eventSession = eventSessionRepository.findById(id);

        return ResponseUtil.wrapOrNotFound(eventSession);
    }

    @DeleteMapping("/event-editions/event-sessions/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public ResponseEntity<Void> deleteEventSession(@PathVariable Long id) {
        log.debug("REST request to delete EventSession : {}", id);
        eventSessionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/event-editions/event-sessions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public ResponseEntity<EventSession> updateEventSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to update EventSession : {}", eventSession);
        if (eventSession.getId() == null) {
            return createEventEditionSession(eventSession);
        }
        eventSession.setEventEdition(eventEditionRepository.findById(eventSession.getEventEdition().getId()).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + eventSession.getEventEdition().getId())
        ));
        EventSession result = eventSessionRepository.save(eventSession);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventSession.getId().toString()))
            .body(result);
    }

    @PutMapping("/event-editions/event-sessions/{sessionId}/process-results")
    @Timed
    //@CacheEvict(cacheNames = {"driversStandingsCache", "teamsStandingsCache", "pointRaceByRace", "winnersCache", "resultsRaceByRace"}) //TODO: Improve to only remove the required key
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> processSessionResults(@PathVariable Long sessionId) {
    	log.debug("Processing results of session {}", sessionId);
    	EventSession session = eventSessionRepository.findById(sessionId).orElseThrow(
            () -> new MSDBException("Invalid event session id " + sessionId)
        );
    	session.getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
    	resultsService.processSessionResults(sessionId);
    	if (session.getSessionType().equals(SessionType.RACE)) {
			log.info("Updating statistics...", session.getEventEdition().getLongEventName(), session.getName());
			statsService.removeEventStatistics(session.getEventEdition());
			statsService.buildEventStatistics(session.getEventEdition());
			log.info("Statistics updated");
		}
    	return ResponseEntity.ok().build();
    }

    @GetMapping("/event-editions/{id}/entries")
    @Timed
    public List<EventEditionEntry> getEventEditionEntries(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} entries", id);
    	List<EventEditionEntry> result = eventEntryRepository.findEventEditionEntries(id);
    	result.parallelStream().forEach(entry -> {
    		EventEdition tmp = new EventEdition();
    		tmp.setId(entry.getEventEdition().getId());
    		tmp.setMultidriver(entry.getEventEdition().isMultidriver());
    		entry.setEventEdition(tmp);
    	});
    	return result;
    }

    @GetMapping("/event-editions/{eventId}/points/{driverId}")
    @Timed
    @Transactional(readOnly = true)
    @JsonView(ResponseViews.DriverPointsDetailView.class)
    public ResponseEntity<List<DriverPointsDTO>> getEventPointsDriver(@PathVariable Long eventId, @PathVariable Long driverId) {
    	List<DriverPointsDTO> result = resultsService.getDriverPointsEvent(eventId, driverId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{eventId}/points")
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<DriverPointsDTO>> getEventPoints(@PathVariable Long eventId) {
    	List<DriverPointsDTO> result = resultsService.getDriversPointsEvent(eventId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/event-editions/{seriesId}/{eventId}/points")
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<DriverPointsDTO>> getEventPointsInSeries(@PathVariable Long seriesId, @PathVariable Long eventId) {
    	List<DriverPointsDTO> result = resultsService.getDriversPointsEvent(seriesId, eventId);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/event-editions/{idTarget}/entries/{idSource}")
    @Timed
    @Transactional
    public ResponseEntity<Void> copyEntries(@PathVariable Long idTarget, @PathVariable Long idSource) {
    	List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(idSource);
    	EventEdition target = eventEditionRepository.findById(idTarget).orElseThrow(
            () -> new MSDBException("Invalid event edition id " + idTarget)
        );
    	for(EventEditionEntry entry : entries) {
    		EventEditionEntry copiedEntry = new EventEditionEntry();
    		copiedEntry
    			.category(entry.getCategory())
    			.entryName(entry.getEntryName())
    			.eventEdition(target)
    			.raceNumber(entry.getRaceNumber())
    			.chassis(entry.getChassis())
    			.engine(entry.getEngine())
    			.fuel(entry.getFuel())
    			.tyres(entry.getTyres())
    			.team(entry.getTeam())
    			.operatedBy(entry.getOperatedBy())
    			.rookie(entry.getRookie())
    			.setCarImageUrl(entry.getCarImageUrl());

    		List<Driver> copiedList = new ArrayList<>();
    		for(Driver driver: entry.getDrivers()) {
    			copiedList.add(driver);
    		}
    		copiedEntry.drivers(copiedList);

    		eventEntryRepository.save(copiedEntry);
    	}
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, idTarget.toString())).build();
    }

    @PostMapping("/event-editions/{id}/entries")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEditionEntry> createEventEditionEntry(@Valid @RequestBody EventEditionEntry eventEntry) throws URISyntaxException {
        log.debug("REST request to save EventEntry : {}", eventEntry);
        if (eventEntry.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_ENTRY, "idexists", "A new eventEntry cannot already have an ID")).body(null);
        }
        EventEditionEntry result = eventEntryRepository.save(eventEntry);
        if (result.getCarImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getCarImage(), ENTITY_NAME_ENTRY);
			result.setCarImageUrl(cdnUrl);

			result = eventEntryRepository.save(result);
        }
        eventEntrySearchRepo.save(result);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_ENTRY, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/event-editions/{id}/entries")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEditionEntry> updateEventEditionEntry(@Valid @RequestBody EventEditionEntry eventEntry) throws URISyntaxException {
        log.debug("REST request to update EventEntry : {}", eventEntry);
        if (eventEntry.getId() == null) {
            return createEventEditionEntry(eventEntry);
        }
        if (eventEntry.getCarImage() != null) {
	        String cdnUrl = cdnService.uploadImage(eventEntry.getId().toString(), eventEntry.getCarImage(), ENTITY_NAME_ENTRY);
	        eventEntry.setCarImageUrl(cdnUrl);
        }
        EventEditionEntry result = eventEntryRepository.save(eventEntry);
        eventEntrySearchRepo.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME_ENTRY, eventEntry.getId().toString()))
            .body(result);
    }

    @GetMapping("/event-editions/entries/{id}")
    @Timed
    public ResponseEntity<EventEditionEntry> getEventEntry(@PathVariable Long id) {
        log.debug("REST request to get EventEntry : {}", id);
        EventEditionEntry eventEntry = eventEntryRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid event edition entry id " + id)
        );
        EventEdition tmp = new EventEdition();
        tmp.setId(eventEntry.getEventEdition().getId());
        tmp.setMultidriver(eventEntry.getEventEdition().isMultidriver());
        eventEntry.setEventEdition(tmp);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntry));
    }

    @DeleteMapping("/event-editions/entries/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventEntry(@PathVariable Long id) {
        log.debug("REST request to delete EventEntry : {}", id);
        eventEntryRepository.deleteById(id);
        eventEntrySearchRepo.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME_ENTRY, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @Transactional(readOnly = true)
    public List<SessionResultDTO> getEventSessionResults(@PathVariable Long id, @PathVariable Long idSession) {
    	log.debug("REST request to get EventEdition {} results for session {}", id, idSession);
    	List<EventEntryResult> result = eventResultRepository.findBySessionIdOrderByFinalPositionAsc(idSession);

    	return result.parallelStream()
    			.sorted((r1, r2) -> {
    				if (r1.getFinalPosition() < 800 && r2.getFinalPosition() < 800) {
    					return r1.getFinalPosition().compareTo(r2.getFinalPosition());
    				} else if (r1.getFinalPosition() >= 800 && r2.getFinalPosition() >= 800) {
    				    //Both cars DNFed
                        if (r1.getFinalPosition().equals(r2.getFinalPosition())) {
                            if (r2.getLapsCompleted() == null || r1.getLapsCompleted() == null) {
                                return r2.getFinalPosition().compareTo(r1.getFinalPosition()) * -1;
                            } else return r2.getLapsCompleted().compareTo(r1.getLapsCompleted());
                        } else {
                            return r1.getFinalPosition().compareTo(r2.getFinalPosition());
                        }
    				} else if (r1.getFinalPosition() < 800) {
    					return -1;
    				} else {
    					return 1;
    				}
    			})
    			.map(r -> new SessionResultDTO(r)).collect(Collectors.toList());
    }

    @GetMapping("/event-editions/event-sessions/{idSession}/fastestLap")
    @Timed
    public ResponseEntity<Long> getEventSessionFastestTime(@PathVariable Long idSession) {
        Long bestLap = eventResultRepository.findSessionFastestTime(idSession);
        return ResponseEntity.ok(bestLap);
    }

    @GetMapping("/event-editions/event-sessions/{idSession}/maxLaps")
    @Timed
    public ResponseEntity<Integer> getEventSessionMaxLapsCompleted(@PathVariable Long idSession) {
        Integer maxLaps = eventResultRepository.findSessionMaxLapsCompleted(idSession);
        return ResponseEntity.ok(maxLaps);
    }

    @GetMapping("/event-editions/event-sessions/results/{idResult}")
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<EventEntryResult> getEventSessionResult(@PathVariable Long idResult) {
        log.debug("REST request to get eventSessionResult : {}", idResult);
        EventEntryResult eventEntryResult = eventResultRepository.findById(idResult).orElseThrow(
            () -> new MSDBException("Invalid event entry result id " + idResult)
        );
        if (eventEntryResult.getEntry().getEventEdition() != null &&
        		eventEntryResult.getEntry().getEventEdition().getSeriesEditions() != null) {
        	eventEntryResult.getEntry().getEventEdition().getSeriesEditions().stream().forEach(sEd -> {
        		SeriesEdition tmp = new SeriesEdition();
        		tmp.setId(sEd.getId());
        		tmp.setEditionName(sEd.getEditionName());
        		Series tmpSeries = new Series();
        		tmpSeries.setId(sEd.getSeries().getId());
        		tmp.setSeries(tmpSeries.name(sEd.getSeries().getName()));
        		tmp.setSeries(tmpSeries);
    			//eventEntryResult.getEntry().getEventEdition().setSeriesEdition(tmp);
        	});

        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntryResult));
    }

    @GetMapping("/event-editions/calendar/{startDate}/{endDate}")
    @Timed
    public List<SessionCalendarDTO> getEvents(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
    	LocalDateTime startMidnight = LocalDateTime.of(startDate, LocalTime.MIDNIGHT);
		ZonedDateTime start = ZonedDateTime.of(startMidnight, ZoneId.of("UTC"));
		ZonedDateTime end = ZonedDateTime.of(endDate.atTime(23, 59, 59), ZoneId.of("UTC"));
    	List<EventSession> tmp = eventSessionRepository.findUpcomingSessions(start.toEpochSecond(), end.toEpochSecond());
    	return tmp.parallelStream().map(session -> {
    		String[] logoUrl = null;
    		if (session.getEventEdition().getSeriesEditions() != null) {
    			logoUrl = session.getEventEdition().getSeriesEditions().stream()
    					.map(sEd -> sEd.getSeries().getLogoUrl())
    					.toArray(String[]::new);
    		}
    		return new SessionCalendarDTO(session.getEventEdition().getId(),
    				session.getEventEdition().getLongEventName(),
    				session.getName(),
    				session.getSessionTypeValue(),
    				session.getSessionStartTimeDate(), session.getSessionEndTime(),
    				session.getEventEdition().getStatus().getCode(),
    				logoUrl);
    	}).collect(Collectors.toList());
    }

    @PostMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<EventEntryResult> createEventSessionResult(@Valid @RequestBody EventEntryResult eventSessionResult) throws URISyntaxException {
        log.debug("REST request to save EventEntryResult : {}", eventSessionResult);
        eventSessionResult.getSession().getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
        if (eventSessionResult.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		applicationName, true, ENTITY_NAME_ENTRY, "idexists", "A new eventSessionResult cannot already have an ID")).body(null);
        }
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_RESULT, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/event-editions/event-sessions/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<EventEntryResult> updateEventSessionResult(@Valid @RequestBody EventEntryResult eventSessionResult) throws URISyntaxException {
        log.debug("REST request to update EventEntryResult : {}", eventSessionResult);
        eventSessionResult.getSession().getEventEdition().getSeriesEditions().forEach(seriesEdition -> cacheHandler.resetSeriesEditionCaches(seriesEdition));
        if (eventSessionResult.getId() == null) {
            return createEventSessionResult(eventSessionResult);
        }
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.ok()
            .headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME_RESULT, eventSessionResult.getId().toString()))
            .body(result);
    }

    @DeleteMapping("/event-editions/event-sessions/results/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventSessionResult(@PathVariable Long id) {
        log.debug("REST request to delete EventSessionResult : {}", id);
        eventResultRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME_RESULT, id.toString())).build();
    }

    @GetMapping("/event-editions/{id}/bestTimes")
    @Timed
    public ResponseEntity<String[][]> getDriversBestTimes(@PathVariable Long id) {
    	log.debug("REST request to retrieve drivers best times on event {}", id);
    	return ResponseEntity.ok(resultsService.getDriverEventBestTimes(id));
    }

    @PutMapping("/event-editions/{id}/reschedule")
    @Timed
    public ResponseEntity<EventEdition> rescheduleEvent(@PathVariable Long id, @Valid @RequestBody LocalDate newDate) {
        EventEdition event = eventEditionRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid event edition id"));
        event = eventService.rescheduleEvent(event, newDate);
        return ResponseEntity.ok()
            .headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .body(event);
    }
}

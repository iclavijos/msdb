package com.icesoft.msdb.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.EventsSeriesNavigationDTO;
import com.icesoft.msdb.service.dto.SessionCalendarDTO;
import com.icesoft.msdb.service.dto.SessionResultDTO;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import com.icesoft.msdb.web.rest.views.ResponseViews;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing EventEdition.
 */
@RestController
@RequestMapping("/api")
public class EventEditionResource {

    private final Logger log = LoggerFactory.getLogger(EventEditionResource.class);

    private static final String ENTITY_NAME = "eventEdition";
    private static final String ENTITY_NAME_SESSION = "eventSession";
    private static final String ENTITY_NAME_ENTRY = "eventEntry";
    private static final String ENTITY_NAME_RESULT = "eventEntryResult";
        
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
    private final JDBCRepositoryImpl jdbcRepo;
    
    public EventEditionResource(EventEditionRepository eventEditionRepository, EventEditionSearchRepository eventEditionSearchRepo,
    		EventEntrySearchRepository eventEntrySearchRepo, EventSessionRepository eventSessionRepository, 
    		EventEntryRepository eventEntryRepository, EventEntryResultRepository resultRepository, 
    		RacetrackLayoutRepository racetrackLayoutRepo, ResultsService resultsService, 
    		CDNService cdnService, StatisticsService statsService, JDBCRepositoryImpl jdbcRepo) {
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
        this.jdbcRepo = jdbcRepo;
    }

    /**
     * POST  /event-editions : Create a new eventEdition.
     *
     * @param eventEdition the eventEdition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventEdition, or with status 400 (Bad Request) if the eventEdition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<EventEdition> createEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to save EventEdition : {}", eventEdition);
        eventEdition.setTrackLayout(racetrackLayoutRepo.findOne(eventEdition.getTrackLayout().getId()));
        if (eventEdition.getId() != null) {
            throw new BadRequestAlertException("A new eventEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepo.save(result);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /event-editions : Updates an existing eventEdition.
     *
     * @param eventEdition the eventEdition to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventEdition,
     * or with status 400 (Bad Request) if the eventEdition is not valid,
     * or with status 500 (Internal Server Error) if the eventEdition couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<EventEdition> updateEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to update EventEdition : {}", eventEdition);
        eventEdition.setTrackLayout(racetrackLayoutRepo.findOne(eventEdition.getTrackLayout().getId()));
        if (eventEdition.getId() == null) {
            return createEventEdition(eventEdition);
        }
        EventEdition result = eventEditionRepository.getOne(eventEdition.getId());
        if (result.getSeriesEdition() != null) {
    		eventEdition.setSeriesEdition(result.getSeriesEdition());
    	}
        result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepo.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventEdition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-editions : get all the eventEditions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of eventEditions in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/event-editions")
    @Timed
    public ResponseEntity<List<EventEdition>> getAllEventEditions(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of EventEditions");
        Page<EventEdition> page = eventEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/event-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /event-editions/:id : get the "id" eventEdition.
     *
     * @param id the id of the eventEdition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventEdition, or with status 404 (Not Found)
     */
    @GetMapping("/event-editions/{id}")
    @Timed
    public ResponseEntity<EventEdition> getEventEdition(@PathVariable Long id) {
        log.debug("REST request to get EventEdition : {}", id);
        EventEdition eventEdition = eventEditionRepository.findOne(id);
        if (eventEdition != null) {
        	List<Long> tmp = eventEditionRepository.findNextEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.nextEditionId(tmp.get(0));
        	}
        	tmp = eventEditionRepository.findPreviousEditionId(eventEdition.getEvent().getId(), eventEdition.getEditionYear());
        	if (tmp != null && !tmp.isEmpty()) {
        		eventEdition.previousEditionId(tmp.get(0));
        	}

        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEdition));
    }

    /**
     * DELETE  /event-editions/:id : delete the "id" eventEdition.
     *
     * @param id the id of the eventEdition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-editions/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteEventEdition(@PathVariable Long id) {
        log.debug("REST request to delete EventEdition : {}", id);
        eventEditionRepository.delete(id);
        eventEditionSearchRepo.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping("/event-editions/{id}/prevNextInSeries")
    @Timed
    @Transactional(readOnly=true)
    public EventsSeriesNavigationDTO getPrevNextIdInSeries(@PathVariable Long id) {
    	return jdbcRepo.getNavigation(id);
    }

    /**
     * SEARCH  /_search/event-editions?query=:query : search for the eventEdition corresponding
     * to the query.
     *
     * @param query the query of the eventEdition search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/event-editions")
    @Timed
    public ResponseEntity<List<EventEdition>> searchEventEditions(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of EventEditions for query {}", query);
        String searchValue = '*' + query + '*';
        Page<EventEdition> page = eventEditionSearchRepo.search(queryStringQuery(searchValue), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/event-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/event-editions/{id}/sessions")
    @Timed
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

    @PostMapping("/event-editions/{id}/sessions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public ResponseEntity<EventSession> createEventEditionSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to save EventSession : {}", eventSession);
        if (eventSession.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		ENTITY_NAME_SESSION, "idexists", "A new eventSession cannot already have an ID")).body(null);
        }
        EventSession result = eventSessionRepository.save(eventSession);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/sessions"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME_SESSION, result.getId().toString()))
            .body(result);
    }
    
    @GetMapping("/event-editions/event-sessions/{id}")
    @Timed
    public ResponseEntity<EventSession> getEventSession(@PathVariable Long id) {
        log.debug("REST request to get EventSession : {}", id);
        EventSession eventSession = eventSessionRepository.findOne(id);

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventSession));
    }
    
    @DeleteMapping("/event-editions/event-sessions/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public ResponseEntity<Void> deleteEventSession(@PathVariable Long id) {
        log.debug("REST request to delete EventSession : {}", id);
        eventSessionRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
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
        eventSession.setEventEdition(eventEditionRepository.findOne(eventSession.getEventEdition().getId()));
        EventSession result = eventSessionRepository.save(eventSession);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventSession.getId().toString()))
            .body(result);
    }
    
    @PutMapping("/event-editions/event-sessions/{sessionId}/process-results")
    @Timed
    @CacheEvict({"driversStandingsCache", "teamsStandingsCache", "pointRaceByRace", "winnersCache"}) //TODO: Improve to only remove the required key
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> processSessionResults(@PathVariable Long sessionId) {
    	log.debug("Processing results of session {}", sessionId);
    	EventSession session = eventSessionRepository.findOne(sessionId);
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
    
    @PostMapping("/event-editions/{idTarget}/entries/{idSource}")
    @Timed
    @Transactional
    public ResponseEntity<Void> copyEntries(@PathVariable Long idTarget, @PathVariable Long idSource) {
    	List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(idSource);
    	EventEdition target = eventEditionRepository.findOne(idTarget);
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
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, idTarget.toString())).build();
    }
    
    @PostMapping("/event-editions/{id}/entries")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEditionEntry> createEventEditionEntry(@Valid @RequestBody EventEditionEntry eventEntry) throws URISyntaxException {
        log.debug("REST request to save EventEntry : {}", eventEntry);
        if (eventEntry.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		ENTITY_NAME_ENTRY, "idexists", "A new eventEntry cannot already have an ID")).body(null);
        }
        EventEditionEntry result = eventEntryRepository.save(eventEntry);
        if (result.getCarImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getCarImage(), ENTITY_NAME_ENTRY);
			result.setCarImageUrl(cdnUrl);
			
			result = eventEntryRepository.save(result);
        }
        eventEntrySearchRepo.save(result);
        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME_ENTRY, result.getId().toString()))
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
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME_ENTRY, eventEntry.getId().toString()))
            .body(result);
    }
    
    @GetMapping("/event-editions/entries/{id}")
    @Timed
    public ResponseEntity<EventEditionEntry> getEventEntry(@PathVariable Long id) {
        log.debug("REST request to get EventEntry : {}", id);
        EventEditionEntry eventEntry = eventEntryRepository.findOne(id);
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
        eventEntryRepository.delete(id);
        eventEntrySearchRepo.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME_ENTRY, id.toString())).build();
    }
    
    @GetMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    public List<SessionResultDTO> getEventSessionResults(@PathVariable Long id, @PathVariable Long idSession) {
    	log.debug("REST request to get EventEdition {} results for session {}", id, idSession);
    	List<EventEntryResult> result = eventResultRepository.findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAscLapsCompletedDesc(idSession, id);

    	return result.parallelStream().map(r -> new SessionResultDTO(r)).collect(Collectors.toList());
    }
    
    @GetMapping("/event-editions/event-sessions/results/{idResult}")
    @Timed
    public ResponseEntity<EventEntryResult> getEventSessionResult(@PathVariable Long idResult) {
        log.debug("REST request to get eventSessionResult : {}", idResult);
        EventEntryResult eventEntryResult = eventResultRepository.findOne(idResult);
        if (eventEntryResult.getEntry().getEventEdition() != null &&
        		eventEntryResult.getEntry().getEventEdition().getSeriesEdition() != null) {
        	SeriesEdition tmp = new SeriesEdition();
    		tmp.setId(eventEntryResult.getEntry().getEventEdition().getSeriesEdition().getId());
    		tmp.setEditionName(eventEntryResult.getEntry().getEventEdition().getSeriesEdition().getEditionName());
    		Series tmpSeries = new Series();
    		tmpSeries.setId(eventEntryResult.getEntry().getEventEdition().getSeriesEdition().getSeries().getId());
    		tmp.setSeries(tmpSeries.name(eventEntryResult.getEntry().getEventEdition().getSeriesEdition().getSeries().getName()));
    		tmp.setSeries(tmpSeries);
			eventEntryResult.getEntry().getEventEdition().setSeriesEdition(tmp);
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntryResult));
    }
    
    @GetMapping("/event-editions/calendar/{startDate}/{endDate}")
    @Timed
    public List<SessionCalendarDTO> getEvents(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
    	LocalDateTime startMidnight = LocalDateTime.of(startDate, LocalTime.MIDNIGHT);
		ZonedDateTime start = ZonedDateTime.of(startMidnight, ZoneId.of("UTC"));
		ZonedDateTime end = ZonedDateTime.of(endDate.atTime(23, 59, 59), ZoneId.of("UTC"));
    	List<EventSession> tmp = eventSessionRepository.findUpcomingSessions(start, end);
    	return tmp.parallelStream().map(session -> {
    		String logoUrl = null;
    		if (session.getEventEdition().getSeriesEdition() != null) {
    			logoUrl = session.getEventEdition().getSeriesEdition().getSeries().getLogoUrl();
    		}
    		return new SessionCalendarDTO(session.getEventEdition().getId(), 
    				session.getEventEdition().getLongEventName(),
    				session.getName(),
    				session.getSessionTypeValue(),
    				session.getSessionStartTime(), session.getSessionEndTime(),
    				logoUrl);
    	}).collect(Collectors.toList());
    }
    
    @PostMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="winnersCache", key="#eventSessionResult.entry.id")
    public ResponseEntity<EventEntryResult> createEventSessionResult(@Valid @RequestBody EventEntryResult eventSessionResult) throws URISyntaxException {
        log.debug("REST request to save EventEntryResult : {}", eventSessionResult);
        if (eventSessionResult.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(
            		ENTITY_NAME_ENTRY, "idexists", "A new eventSessionResult cannot already have an ID")).body(null);
        }
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.created(new URI("/api/event-editions/" + result.getId() +"/entries"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME_RESULT, result.getId().toString()))
            .body(result);
    }
    
    @PutMapping("/event-editions/event-sessions/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="winnersCache", key="#eventSessionResult.entry.id")
    public ResponseEntity<EventEntryResult> updateEventSessionResult(@Valid @RequestBody EventEntryResult eventSessionResult) throws URISyntaxException {
        log.debug("REST request to update EventEntryResult : {}", eventSessionResult);
        if (eventSessionResult.getId() == null) {
            return createEventSessionResult(eventSessionResult);
        }
        EventEntryResult result = eventResultRepository.save(eventSessionResult);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME_RESULT, eventSessionResult.getId().toString()))
            .body(result);
    }
    
    @DeleteMapping("/event-editions/event-sessions/results/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventSessionResult(@PathVariable Long id) {
        log.debug("REST request to delete EventSessionResult : {}", id);
        eventResultRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME_RESULT, id.toString())).build();
    }
}

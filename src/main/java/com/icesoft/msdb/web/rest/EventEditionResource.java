package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
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
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import com.icesoft.msdb.web.rest.view.MSDBView;

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
    private final EventSessionRepository eventSessionRepository;
    private final EventEntryRepository eventEntryRepository;
    private final EventEntryResultRepository eventResultRepository;
    private final SearchService searchService;

    public EventEditionResource(EventEditionRepository eventEditionRepository, EventSessionRepository eventSessionRepository, 
    		EventEntryRepository eventEntryRepository, EventEntryResultRepository resultRepository, SearchService searchService) {
        this.eventEditionRepository = eventEditionRepository;
        this.eventSessionRepository = eventSessionRepository;
        this.eventEntryRepository = eventEntryRepository;
        this.eventResultRepository = resultRepository;
        this.searchService = searchService;
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
        if (eventEdition.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new eventEdition cannot already have an ID")).body(null);
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
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
     * or with status 500 (Internal Server Error) if the eventEdition couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventEdition> updateEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to update EventEdition : {}", eventEdition);
        if (eventEdition.getId() == null) {
            return createEventEdition(eventEdition);
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
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
    public ResponseEntity<List<EventEdition>> getAllEventEditions(@ApiParam Pageable pageable)
        throws URISyntaxException {
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
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/event-editions?query=:query : search for the eventEdition corresponding
     * to the query.
     *
     * @param query the query of the eventEdition search 
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/event-editions")
    @Timed
    public ResponseEntity<List<EventEdition>> searchEventEditions(@RequestParam String query, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of EventEditions for query {}", query);
        Page<EventEdition> page = searchService.searchEventEditions(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/event-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/event-editions/{id}/sessions")
    @Timed
    public List<EventSession> getEventEditionSessions(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} sessions", id);
    	return eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(id);
    }

    @PostMapping("/event-editions/{id}/sessions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
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
    public ResponseEntity<Void> deleteEventSession(@PathVariable Long id) {
        log.debug("REST request to delete EventSession : {}", id);
        eventSessionRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    @PutMapping("/event-editions/event-sessions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<EventSession> updateEventSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to update EventSession : {}", eventSession);
        if (eventSession.getId() == null) {
            return createEventEditionSession(eventSession);
        }
        EventSession result = eventSessionRepository.save(eventSession);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventSession.getId().toString()))
            .body(result);
    }
    
    @GetMapping("/event-editions/{id}/entries")
    @Timed
    public List<EventEditionEntry> getEventEditionEntries(@PathVariable Long id) {
    	log.debug("REST request to get all EventEditions {} entries", id);
    	return eventEntryRepository.findEventEditionEntries(id);
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
    			.operatedBy(entry.getOperatedBy());
    		
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
        EventEditionEntry result = eventEntryRepository.save(eventEntry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME_ENTRY, eventEntry.getId().toString()))
            .body(result);
    }
    
    @GetMapping("/event-editions/entries/{id}")
    @Timed
    public ResponseEntity<EventEditionEntry> getEventEntry(@PathVariable Long id) {
        log.debug("REST request to get EventEntry : {}", id);
        EventEditionEntry eventEntry = eventEntryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntry));
    }
    
    @DeleteMapping("/event-editions/entries/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEventEntry(@PathVariable Long id) {
        log.debug("REST request to delete EventEntry : {}", id);
        eventEntryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME_ENTRY, id.toString())).build();
    }
    
    @GetMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @JsonView(MSDBView.SessionResultsView.class)
    public List<EventEntryResult> getEventSessionResults(@PathVariable Long id, @PathVariable Long idSession) {
    	log.debug("REST request to get EventEdition {} results for session {}", id, idSession);
    	return eventResultRepository.findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAsc(idSession, id);
    }
    
    @GetMapping("/event-editions/event-sessions/results/{idResult}")
    @Timed
    public ResponseEntity<EventEntryResult> getEventSessionResult(@PathVariable Long idResult) {
        log.debug("REST request to get eventSessionResult : {}", idResult);
        EventEntryResult eventEntryResult = eventResultRepository.findOne(idResult);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntryResult));
    }
    
    @PostMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
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
    
    @PutMapping("/event-editions/{id}/event-sessions/{idSession}/results")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
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

package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.search.EventSessionSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.EventSession}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventSessionResource {

    private final Logger log = LoggerFactory.getLogger(EventSessionResource.class);

    private static final String ENTITY_NAME = "eventSession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventSessionRepository eventSessionRepository;

    private final EventSessionSearchRepository eventSessionSearchRepository;

    public EventSessionResource(EventSessionRepository eventSessionRepository, EventSessionSearchRepository eventSessionSearchRepository) {
        this.eventSessionRepository = eventSessionRepository;
        this.eventSessionSearchRepository = eventSessionSearchRepository;
    }

    /**
     * {@code POST  /event-sessions} : Create a new eventSession.
     *
     * @param eventSession the eventSession to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventSession, or with status {@code 400 (Bad Request)} if the eventSession has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-sessions")
    public ResponseEntity<EventSession> createEventSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to save EventSession : {}", eventSession);
        if (eventSession.getId() != null) {
            throw new BadRequestAlertException("A new eventSession cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventSession result = eventSessionRepository.save(eventSession);
        eventSessionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-sessions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-sessions} : Updates an existing eventSession.
     *
     * @param eventSession the eventSession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventSession,
     * or with status {@code 400 (Bad Request)} if the eventSession is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventSession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-sessions")
    public ResponseEntity<EventSession> updateEventSession(@Valid @RequestBody EventSession eventSession) throws URISyntaxException {
        log.debug("REST request to update EventSession : {}", eventSession);
        if (eventSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventSession result = eventSessionRepository.save(eventSession);
        eventSessionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventSession.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /event-sessions} : get all the eventSessions.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventSessions in body.
     */
    @GetMapping("/event-sessions")
    public List<EventSession> getAllEventSessions() {
        log.debug("REST request to get all EventSessions");
        return eventSessionRepository.findAll();
    }

    /**
     * {@code GET  /event-sessions/:id} : get the "id" eventSession.
     *
     * @param id the id of the eventSession to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventSession, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-sessions/{id}")
    public ResponseEntity<EventSession> getEventSession(@PathVariable Long id) {
        log.debug("REST request to get EventSession : {}", id);
        Optional<EventSession> eventSession = eventSessionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventSession);
    }

    /**
     * {@code DELETE  /event-sessions/:id} : delete the "id" eventSession.
     *
     * @param id the id of the eventSession to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-sessions/{id}")
    public ResponseEntity<Void> deleteEventSession(@PathVariable Long id) {
        log.debug("REST request to delete EventSession : {}", id);
        eventSessionRepository.deleteById(id);
        eventSessionSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/event-sessions?query=:query} : search for the eventSession corresponding
     * to the query.
     *
     * @param query the query of the eventSession search.
     * @return the result of the search.
     */
    @GetMapping("/_search/event-sessions")
    public List<EventSession> searchEventSessions(@RequestParam String query) {
        log.debug("REST request to search EventSessions for query {}", query);
        return StreamSupport
            .stream(eventSessionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

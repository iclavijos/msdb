package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.search.EventEntryResultSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.EventEntryResult}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventEntryResultResource {

    private final Logger log = LoggerFactory.getLogger(EventEntryResultResource.class);

    private static final String ENTITY_NAME = "eventEntryResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventEntryResultRepository eventEntryResultRepository;

    private final EventEntryResultSearchRepository eventEntryResultSearchRepository;

    public EventEntryResultResource(EventEntryResultRepository eventEntryResultRepository, EventEntryResultSearchRepository eventEntryResultSearchRepository) {
        this.eventEntryResultRepository = eventEntryResultRepository;
        this.eventEntryResultSearchRepository = eventEntryResultSearchRepository;
    }

    /**
     * {@code POST  /event-entry-results} : Create a new eventEntryResult.
     *
     * @param eventEntryResult the eventEntryResult to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventEntryResult, or with status {@code 400 (Bad Request)} if the eventEntryResult has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-entry-results")
    public ResponseEntity<EventEntryResult> createEventEntryResult(@RequestBody EventEntryResult eventEntryResult) throws URISyntaxException {
        log.debug("REST request to save EventEntryResult : {}", eventEntryResult);
        if (eventEntryResult.getId() != null) {
            throw new BadRequestAlertException("A new eventEntryResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEntryResult result = eventEntryResultRepository.save(eventEntryResult);
        eventEntryResultSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-entry-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-entry-results} : Updates an existing eventEntryResult.
     *
     * @param eventEntryResult the eventEntryResult to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventEntryResult,
     * or with status {@code 400 (Bad Request)} if the eventEntryResult is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventEntryResult couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-entry-results")
    public ResponseEntity<EventEntryResult> updateEventEntryResult(@RequestBody EventEntryResult eventEntryResult) throws URISyntaxException {
        log.debug("REST request to update EventEntryResult : {}", eventEntryResult);
        if (eventEntryResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventEntryResult result = eventEntryResultRepository.save(eventEntryResult);
        eventEntryResultSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventEntryResult.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /event-entry-results} : get all the eventEntryResults.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventEntryResults in body.
     */
    @GetMapping("/event-entry-results")
    public List<EventEntryResult> getAllEventEntryResults() {
        log.debug("REST request to get all EventEntryResults");
        return eventEntryResultRepository.findAll();
    }

    /**
     * {@code GET  /event-entry-results/:id} : get the "id" eventEntryResult.
     *
     * @param id the id of the eventEntryResult to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventEntryResult, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-entry-results/{id}")
    public ResponseEntity<EventEntryResult> getEventEntryResult(@PathVariable Long id) {
        log.debug("REST request to get EventEntryResult : {}", id);
        Optional<EventEntryResult> eventEntryResult = eventEntryResultRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventEntryResult);
    }

    /**
     * {@code DELETE  /event-entry-results/:id} : delete the "id" eventEntryResult.
     *
     * @param id the id of the eventEntryResult to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-entry-results/{id}")
    public ResponseEntity<Void> deleteEventEntryResult(@PathVariable Long id) {
        log.debug("REST request to delete EventEntryResult : {}", id);
        eventEntryResultRepository.deleteById(id);
        eventEntryResultSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/event-entry-results?query=:query} : search for the eventEntryResult corresponding
     * to the query.
     *
     * @param query the query of the eventEntryResult search.
     * @return the result of the search.
     */
    @GetMapping("/_search/event-entry-results")
    public List<EventEntryResult> searchEventEntryResults(@RequestParam String query) {
        log.debug("REST request to search EventEntryResults for query {}", query);
        return StreamSupport
            .stream(eventEntryResultSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

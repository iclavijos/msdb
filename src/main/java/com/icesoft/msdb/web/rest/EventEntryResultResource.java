package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.EventEntryResult;

import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.search.EventEntryResultSearchRepository;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing EventEntryResult.
 */
@RestController
@RequestMapping("/api")
public class EventEntryResultResource {

    private final Logger log = LoggerFactory.getLogger(EventEntryResultResource.class);

    private static final String ENTITY_NAME = "eventEntryResult";
        
    private final EventEntryResultRepository eventEntryResultRepository;

    private final EventEntryResultSearchRepository eventEntryResultSearchRepository;

    public EventEntryResultResource(EventEntryResultRepository eventEntryResultRepository, EventEntryResultSearchRepository eventEntryResultSearchRepository) {
        this.eventEntryResultRepository = eventEntryResultRepository;
        this.eventEntryResultSearchRepository = eventEntryResultSearchRepository;
    }

    /**
     * POST  /event-entry-results : Create a new eventEntryResult.
     *
     * @param eventEntryResult the eventEntryResult to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventEntryResult, or with status 400 (Bad Request) if the eventEntryResult has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-entry-results")
    @Timed
    public ResponseEntity<EventEntryResult> createEventEntryResult(@RequestBody EventEntryResult eventEntryResult) throws URISyntaxException {
        log.debug("REST request to save EventEntryResult : {}", eventEntryResult);
        if (eventEntryResult.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new eventEntryResult cannot already have an ID")).body(null);
        }
        EventEntryResult result = eventEntryResultRepository.save(eventEntryResult);
        eventEntryResultSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-entry-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /event-entry-results : Updates an existing eventEntryResult.
     *
     * @param eventEntryResult the eventEntryResult to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventEntryResult,
     * or with status 400 (Bad Request) if the eventEntryResult is not valid,
     * or with status 500 (Internal Server Error) if the eventEntryResult couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-entry-results")
    @Timed
    public ResponseEntity<EventEntryResult> updateEventEntryResult(@RequestBody EventEntryResult eventEntryResult) throws URISyntaxException {
        log.debug("REST request to update EventEntryResult : {}", eventEntryResult);
        if (eventEntryResult.getId() == null) {
            return createEventEntryResult(eventEntryResult);
        }
        EventEntryResult result = eventEntryResultRepository.save(eventEntryResult);
        eventEntryResultSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventEntryResult.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-entry-results : get all the eventEntryResults.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of eventEntryResults in body
     */
    @GetMapping("/event-entry-results")
    @Timed
    public List<EventEntryResult> getAllEventEntryResults() {
        log.debug("REST request to get all EventEntryResults");
        List<EventEntryResult> eventEntryResults = eventEntryResultRepository.findAll();
        return eventEntryResults;
    }

    /**
     * GET  /event-entry-results/:id : get the "id" eventEntryResult.
     *
     * @param id the id of the eventEntryResult to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventEntryResult, or with status 404 (Not Found)
     */
    @GetMapping("/event-entry-results/{id}")
    @Timed
    public ResponseEntity<EventEntryResult> getEventEntryResult(@PathVariable Long id) {
        log.debug("REST request to get EventEntryResult : {}", id);
        EventEntryResult eventEntryResult = eventEntryResultRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntryResult));
    }

    /**
     * DELETE  /event-entry-results/:id : delete the "id" eventEntryResult.
     *
     * @param id the id of the eventEntryResult to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-entry-results/{id}")
    @Timed
    public ResponseEntity<Void> deleteEventEntryResult(@PathVariable Long id) {
        log.debug("REST request to delete EventEntryResult : {}", id);
        eventEntryResultRepository.delete(id);
        eventEntryResultSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/event-entry-results?query=:query : search for the eventEntryResult corresponding
     * to the query.
     *
     * @param query the query of the eventEntryResult search 
     * @return the result of the search
     */
    @GetMapping("/_search/event-entry-results")
    @Timed
    public List<EventEntryResult> searchEventEntryResults(@RequestParam String query) {
        log.debug("REST request to search EventEntryResults for query {}", query);
        return StreamSupport
            .stream(eventEntryResultSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}

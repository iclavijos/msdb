package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.EventEdition;

import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
 * REST controller for managing EventEdition.
 */
@RestController
@RequestMapping("/api")
public class EventEditionResource {

    private final Logger log = LoggerFactory.getLogger(EventEditionResource.class);

    private static final String ENTITY_NAME = "eventEdition";

    private final EventEditionRepository eventEditionRepository;

    private final EventEditionSearchRepository eventEditionSearchRepository;

    public EventEditionResource(EventEditionRepository eventEditionRepository, EventEditionSearchRepository eventEditionSearchRepository) {
        this.eventEditionRepository = eventEditionRepository;
        this.eventEditionSearchRepository = eventEditionSearchRepository;
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
    public ResponseEntity<EventEdition> createEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to save EventEdition : {}", eventEdition);
        if (eventEdition.getId() != null) {
            throw new BadRequestAlertException("A new eventEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepository.save(result);
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
    public ResponseEntity<EventEdition> updateEventEdition(@Valid @RequestBody EventEdition eventEdition) throws URISyntaxException {
        log.debug("REST request to update EventEdition : {}", eventEdition);
        if (eventEdition.getId() == null) {
            return createEventEdition(eventEdition);
        }
        EventEdition result = eventEditionRepository.save(eventEdition);
        eventEditionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventEdition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-editions : get all the eventEditions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of eventEditions in body
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
    public ResponseEntity<Void> deleteEventEdition(@PathVariable Long id) {
        log.debug("REST request to delete EventEdition : {}", id);
        eventEditionRepository.delete(id);
        eventEditionSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
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
        Page<EventEdition> page = eventEditionSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/event-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

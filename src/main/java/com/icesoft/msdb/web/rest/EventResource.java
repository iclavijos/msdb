package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.dto.EventEditionIdYearDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Event.
 */
@RestController
@RequestMapping("/api")
public class EventResource {

    private final Logger log = LoggerFactory.getLogger(EventResource.class);

    private static final String ENTITY_NAME = "event";

    private final EventService eventService;

    public EventResource(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * POST  /events : Create a new event.
     *
     * @param event the event to create
     * @return the ResponseEntity with status 201 (Created) and with body the new event, or with status 400 (Bad Request) if the event has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/events")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) throws URISyntaxException {
        log.debug("REST request to save Event : {}", event);
        if (event.getId() != null) {
            throw new BadRequestAlertException("A new event cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Event result = eventService.save(event);
        return ResponseEntity.created(new URI("/api/events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /events : Updates an existing event.
     *
     * @param event the event to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated event,
     * or with status 400 (Bad Request) if the event is not valid,
     * or with status 500 (Internal Server Error) if the event couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/events")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Event> updateEvent(@Valid @RequestBody Event event) throws URISyntaxException {
        log.debug("REST request to update Event : {}", event);
        if (event.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Event result = eventService.save(event);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, event.getId().toString()))
            .body(result);
    }

    /**
     * GET  /events : get all the events.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of events in body
     */
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents(Pageable pageable) {
        log.debug("REST request to get a page of Events");
        Page<Event> page = eventService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/events");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /events/:id : get the "id" event.
     *
     * @param id the id of the event to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the event, or with status 404 (Not Found)
     */
    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        log.debug("REST request to get Event : {}", id);
        Event event = eventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(event));
    }

    /**
     * DELETE  /events/:id : delete the "id" event.
     *
     * @param id the id of the event to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/events/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        log.debug("REST request to delete Event : {}", id);
        eventService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/events?query=:query : search for the event corresponding
     * to the query.
     *
     * @param query the query of the event search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/events")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Events for query {}", query);
        Page<Event> page = eventService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/events");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_typeahead/events")
    public List<Event> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of events for query {}", query);
        Page<Event> page = eventService.search(query, PageRequest.of(0, 5));
        return page.getContent();
    }

    @GetMapping("/events/{id}/editions")
    public ResponseEntity<List<EventEdition>> findEventEditions(@PathVariable Long id, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to find for a page of editions of event {}", id);
        Page<EventEdition> page = eventService.findEventEditions(id, pageable);
        //page.getContent().parallelStream().forEach(event -> event.setSeriesEdition(null));
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(id.toString(), page, "/events/" + id + "/editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/events/{id}/editionIds")
    public ResponseEntity<List<EventEditionIdYearDTO>> findEventEditionsIds(@PathVariable Long id) {
    	return new ResponseEntity<>(eventService.findEventEditionsIdYear(id), HttpStatus.OK);
    }
}

package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.EventEntry;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.EventEntry}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventEntryResource {

    private final Logger log = LoggerFactory.getLogger(EventEntryResource.class);

    private static final String ENTITY_NAME = "eventEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventEntryRepository eventEntryRepository;

    private final EventEntrySearchRepository eventEntrySearchRepository;

    public EventEntryResource(EventEntryRepository eventEntryRepository, EventEntrySearchRepository eventEntrySearchRepository) {
        this.eventEntryRepository = eventEntryRepository;
        this.eventEntrySearchRepository = eventEntrySearchRepository;
    }

    /**
     * {@code POST  /event-entries} : Create a new eventEntry.
     *
     * @param eventEntry the eventEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventEntry, or with status {@code 400 (Bad Request)} if the eventEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-entries")
    public ResponseEntity<EventEntry> createEventEntry(@Valid @RequestBody EventEntry eventEntry) throws URISyntaxException {
        log.debug("REST request to save EventEntry : {}", eventEntry);
        if (eventEntry.getId() != null) {
            throw new BadRequestAlertException("A new eventEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEntry result = eventEntryRepository.save(eventEntry);
        eventEntrySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-entries} : Updates an existing eventEntry.
     *
     * @param eventEntry the eventEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventEntry,
     * or with status {@code 400 (Bad Request)} if the eventEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-entries")
    public ResponseEntity<EventEntry> updateEventEntry(@Valid @RequestBody EventEntry eventEntry) throws URISyntaxException {
        log.debug("REST request to update EventEntry : {}", eventEntry);
        if (eventEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventEntry result = eventEntryRepository.save(eventEntry);
        eventEntrySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /event-entries} : get all the eventEntries.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventEntries in body.
     */
    @GetMapping("/event-entries")
    public List<EventEntry> getAllEventEntries() {
        log.debug("REST request to get all EventEntries");
        return eventEntryRepository.findAll();
    }

    /**
     * {@code GET  /event-entries/:id} : get the "id" eventEntry.
     *
     * @param id the id of the eventEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-entries/{id}")
    public ResponseEntity<EventEntry> getEventEntry(@PathVariable Long id) {
        log.debug("REST request to get EventEntry : {}", id);
        Optional<EventEntry> eventEntry = eventEntryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventEntry);
    }

    /**
     * {@code DELETE  /event-entries/:id} : delete the "id" eventEntry.
     *
     * @param id the id of the eventEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-entries/{id}")
    public ResponseEntity<Void> deleteEventEntry(@PathVariable Long id) {
        log.debug("REST request to delete EventEntry : {}", id);
        eventEntryRepository.deleteById(id);
        eventEntrySearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/event-entries?query=:query} : search for the eventEntry corresponding
     * to the query.
     *
     * @param query the query of the eventEntry search.
     * @return the result of the search.
     */
    @GetMapping("/_search/event-entries")
    public List<EventEntry> searchEventEntries(@RequestParam String query) {
        log.debug("REST request to search EventEntries for query {}", query);
        return StreamSupport
            .stream(eventEntrySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

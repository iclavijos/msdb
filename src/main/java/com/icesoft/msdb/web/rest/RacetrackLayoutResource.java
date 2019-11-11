package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.search.RacetrackLayoutSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.RacetrackLayout}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RacetrackLayoutResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackLayoutResource.class);

    private static final String ENTITY_NAME = "racetrackLayout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RacetrackLayoutRepository racetrackLayoutRepository;

    private final RacetrackLayoutSearchRepository racetrackLayoutSearchRepository;

    public RacetrackLayoutResource(RacetrackLayoutRepository racetrackLayoutRepository, RacetrackLayoutSearchRepository racetrackLayoutSearchRepository) {
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.racetrackLayoutSearchRepository = racetrackLayoutSearchRepository;
    }

    /**
     * {@code POST  /racetrack-layouts} : Create a new racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new racetrackLayout, or with status {@code 400 (Bad Request)} if the racetrackLayout has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/racetrack-layouts")
    public ResponseEntity<RacetrackLayout> createRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to save RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() != null) {
            throw new BadRequestAlertException("A new racetrackLayout cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
        racetrackLayoutSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/racetrack-layouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /racetrack-layouts} : Updates an existing racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated racetrackLayout,
     * or with status {@code 400 (Bad Request)} if the racetrackLayout is not valid,
     * or with status {@code 500 (Internal Server Error)} if the racetrackLayout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/racetrack-layouts")
    public ResponseEntity<RacetrackLayout> updateRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to update RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
        racetrackLayoutSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, racetrackLayout.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /racetrack-layouts} : get all the racetrackLayouts.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of racetrackLayouts in body.
     */
    @GetMapping("/racetrack-layouts")
    public List<RacetrackLayout> getAllRacetrackLayouts() {
        log.debug("REST request to get all RacetrackLayouts");
        return racetrackLayoutRepository.findAll();
    }

    /**
     * {@code GET  /racetrack-layouts/:id} : get the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the racetrackLayout, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/racetrack-layouts/{id}")
    public ResponseEntity<RacetrackLayout> getRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to get RacetrackLayout : {}", id);
        Optional<RacetrackLayout> racetrackLayout = racetrackLayoutRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(racetrackLayout);
    }

    /**
     * {@code DELETE  /racetrack-layouts/:id} : delete the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/racetrack-layouts/{id}")
    public ResponseEntity<Void> deleteRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to delete RacetrackLayout : {}", id);
        racetrackLayoutRepository.deleteById(id);
        racetrackLayoutSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/racetrack-layouts?query=:query} : search for the racetrackLayout corresponding
     * to the query.
     *
     * @param query the query of the racetrackLayout search.
     * @return the result of the search.
     */
    @GetMapping("/_search/racetrack-layouts")
    public List<RacetrackLayout> searchRacetrackLayouts(@RequestParam String query) {
        log.debug("REST request to search RacetrackLayouts for query {}", query);
        return StreamSupport
            .stream(racetrackLayoutSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

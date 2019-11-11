package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.Racetrack}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RacetrackResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackResource.class);

    private static final String ENTITY_NAME = "racetrack";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RacetrackRepository racetrackRepository;

    private final RacetrackSearchRepository racetrackSearchRepository;

    public RacetrackResource(RacetrackRepository racetrackRepository, RacetrackSearchRepository racetrackSearchRepository) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackSearchRepository = racetrackSearchRepository;
    }

    /**
     * {@code POST  /racetracks} : Create a new racetrack.
     *
     * @param racetrack the racetrack to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new racetrack, or with status {@code 400 (Bad Request)} if the racetrack has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/racetracks")
    public ResponseEntity<Racetrack> createRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to save Racetrack : {}", racetrack);
        if (racetrack.getId() != null) {
            throw new BadRequestAlertException("A new racetrack cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/racetracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /racetracks} : Updates an existing racetrack.
     *
     * @param racetrack the racetrack to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated racetrack,
     * or with status {@code 400 (Bad Request)} if the racetrack is not valid,
     * or with status {@code 500 (Internal Server Error)} if the racetrack couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/racetracks")
    public ResponseEntity<Racetrack> updateRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to update Racetrack : {}", racetrack);
        if (racetrack.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, racetrack.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /racetracks} : get all the racetracks.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of racetracks in body.
     */
    @GetMapping("/racetracks")
    public ResponseEntity<List<Racetrack>> getAllRacetracks(Pageable pageable) {
        log.debug("REST request to get a page of Racetracks");
        Page<Racetrack> page = racetrackRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /racetracks/:id} : get the "id" racetrack.
     *
     * @param id the id of the racetrack to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the racetrack, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/racetracks/{id}")
    public ResponseEntity<Racetrack> getRacetrack(@PathVariable Long id) {
        log.debug("REST request to get Racetrack : {}", id);
        Optional<Racetrack> racetrack = racetrackRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(racetrack);
    }

    /**
     * {@code DELETE  /racetracks/:id} : delete the "id" racetrack.
     *
     * @param id the id of the racetrack to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/racetracks/{id}")
    public ResponseEntity<Void> deleteRacetrack(@PathVariable Long id) {
        log.debug("REST request to delete Racetrack : {}", id);
        racetrackRepository.deleteById(id);
        racetrackSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/racetracks?query=:query} : search for the racetrack corresponding
     * to the query.
     *
     * @param query the query of the racetrack search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/racetracks")
    public ResponseEntity<List<Racetrack>> searchRacetracks(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Racetracks for query {}", query);
        Page<Racetrack> page = racetrackSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

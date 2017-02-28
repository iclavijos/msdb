package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing Racetrack.
 */
@RestController
@RequestMapping("/api")
public class RacetrackResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackResource.class);

    private static final String ENTITY_NAME = "racetrack";
        
    private final RacetrackRepository racetrackRepository;
    
    private final RacetrackLayoutRepository racetrackLayoutRepository;

    private final RacetrackSearchRepository racetrackSearchRepository;

    public RacetrackResource(RacetrackRepository racetrackRepository, RacetrackSearchRepository racetrackSearchRepository, 
    		RacetrackLayoutRepository racetrackLayoutRepository) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackSearchRepository = racetrackSearchRepository;
        this.racetrackLayoutRepository = racetrackLayoutRepository;
    }

    /**
     * POST  /racetracks : Create a new racetrack.
     *
     * @param racetrack the racetrack to create
     * @return the ResponseEntity with status 201 (Created) and with body the new racetrack, or with status 400 (Bad Request) if the racetrack has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/racetracks")
    @Timed
    public ResponseEntity<Racetrack> createRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to save Racetrack : {}", racetrack);
        if (racetrack.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new racetrack cannot already have an ID")).body(null);
        }
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/racetracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /racetracks : Updates an existing racetrack.
     *
     * @param racetrack the racetrack to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated racetrack,
     * or with status 400 (Bad Request) if the racetrack is not valid,
     * or with status 500 (Internal Server Error) if the racetrack couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/racetracks")
    @Timed
    public ResponseEntity<Racetrack> updateRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to update Racetrack : {}", racetrack);
        if (racetrack.getId() == null) {
            return createRacetrack(racetrack);
        }
        Racetrack result = racetrackRepository.save(racetrack);
        racetrackSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, racetrack.getId().toString()))
            .body(result);
    }

    /**
     * GET  /racetracks : get all the racetracks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of racetracks in body
     */
    @GetMapping("/racetracks")
    @Timed
    public List<Racetrack> getAllRacetracks() {
        log.debug("REST request to get all Racetracks");
        List<Racetrack> racetracks = racetrackRepository.findAll();
        return racetracks;
    }

    /**
     * GET  /racetracks/:id : get the "id" racetrack.
     *
     * @param id the id of the racetrack to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the racetrack, or with status 404 (Not Found)
     */
    @GetMapping("/racetracks/{id}")
    @Timed
    public ResponseEntity<Racetrack> getRacetrack(@PathVariable Long id) {
        log.debug("REST request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(racetrack));
    }
    
    /**
     * GET  /racetracks/:id/layouts : get the layouts of "id" racetrack.
     *
     * @param id the id of the racetrack layouts to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the list of layouts, or with status 404 (Not Found)
     */
    @GetMapping("/racetracks/{id}/layouts")
    @Timed
    public List<RacetrackLayout> getRacetrackLayouts(@PathVariable Long id) {
        log.debug("REST request to get Racetrack layouts : {}", id);
        return racetrackLayoutRepository.findByRacetrackIdOrderByYearFirstUseDesc(id);
    }

    /**
     * DELETE  /racetracks/:id : delete the "id" racetrack.
     *
     * @param id the id of the racetrack to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/racetracks/{id}")
    @Timed
    public ResponseEntity<Void> deleteRacetrack(@PathVariable Long id) {
        log.debug("REST request to delete Racetrack : {}", id);
        racetrackRepository.delete(id);
        racetrackSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/racetracks?query=:query : search for the racetrack corresponding
     * to the query.
     *
     * @param query the query of the racetrack search 
     * @return the result of the search
     */
    @GetMapping("/_search/racetracks")
    @Timed
    public List<Racetrack> searchRacetracks(@RequestParam String query) {
        log.debug("REST request to search Racetracks for query {}", query);
        return StreamSupport
            .stream(racetrackSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}

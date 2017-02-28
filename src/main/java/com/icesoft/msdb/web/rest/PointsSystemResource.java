package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.PointsSystem;

import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.search.PointsSystemSearchRepository;
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
 * REST controller for managing PointsSystem.
 */
@RestController
@RequestMapping("/api")
public class PointsSystemResource {

    private final Logger log = LoggerFactory.getLogger(PointsSystemResource.class);

    private static final String ENTITY_NAME = "pointsSystem";
        
    private final PointsSystemRepository pointsSystemRepository;

    private final PointsSystemSearchRepository pointsSystemSearchRepository;

    public PointsSystemResource(PointsSystemRepository pointsSystemRepository, PointsSystemSearchRepository pointsSystemSearchRepository) {
        this.pointsSystemRepository = pointsSystemRepository;
        this.pointsSystemSearchRepository = pointsSystemSearchRepository;
    }

    /**
     * POST  /points-systems : Create a new pointsSystem.
     *
     * @param pointsSystem the pointsSystem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new pointsSystem, or with status 400 (Bad Request) if the pointsSystem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/points-systems")
    @Timed
    public ResponseEntity<PointsSystem> createPointsSystem(@Valid @RequestBody PointsSystem pointsSystem) throws URISyntaxException {
        log.debug("REST request to save PointsSystem : {}", pointsSystem);
        if (pointsSystem.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new pointsSystem cannot already have an ID")).body(null);
        }
        PointsSystem result = pointsSystemRepository.save(pointsSystem);
        pointsSystemSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points-systems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points-systems : Updates an existing pointsSystem.
     *
     * @param pointsSystem the pointsSystem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated pointsSystem,
     * or with status 400 (Bad Request) if the pointsSystem is not valid,
     * or with status 500 (Internal Server Error) if the pointsSystem couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/points-systems")
    @Timed
    public ResponseEntity<PointsSystem> updatePointsSystem(@Valid @RequestBody PointsSystem pointsSystem) throws URISyntaxException {
        log.debug("REST request to update PointsSystem : {}", pointsSystem);
        if (pointsSystem.getId() == null) {
            return createPointsSystem(pointsSystem);
        }
        PointsSystem result = pointsSystemRepository.save(pointsSystem);
        pointsSystemSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pointsSystem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points-systems : get all the pointsSystems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of pointsSystems in body
     */
    @GetMapping("/points-systems")
    @Timed
    public List<PointsSystem> getAllPointsSystems() {
        log.debug("REST request to get all PointsSystems");
        List<PointsSystem> pointsSystems = pointsSystemRepository.findAll();
        return pointsSystems;
    }

    /**
     * GET  /points-systems/:id : get the "id" pointsSystem.
     *
     * @param id the id of the pointsSystem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the pointsSystem, or with status 404 (Not Found)
     */
    @GetMapping("/points-systems/{id}")
    @Timed
    public ResponseEntity<PointsSystem> getPointsSystem(@PathVariable Long id) {
        log.debug("REST request to get PointsSystem : {}", id);
        PointsSystem pointsSystem = pointsSystemRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(pointsSystem));
    }

    /**
     * DELETE  /points-systems/:id : delete the "id" pointsSystem.
     *
     * @param id the id of the pointsSystem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/points-systems/{id}")
    @Timed
    public ResponseEntity<Void> deletePointsSystem(@PathVariable Long id) {
        log.debug("REST request to delete PointsSystem : {}", id);
        pointsSystemRepository.delete(id);
        pointsSystemSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/points-systems?query=:query : search for the pointsSystem corresponding
     * to the query.
     *
     * @param query the query of the pointsSystem search 
     * @return the result of the search
     */
    @GetMapping("/_search/points-systems")
    @Timed
    public List<PointsSystem> searchPointsSystems(@RequestParam String query) {
        log.debug("REST request to search PointsSystems for query {}", query);
        return StreamSupport
            .stream(pointsSystemSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}

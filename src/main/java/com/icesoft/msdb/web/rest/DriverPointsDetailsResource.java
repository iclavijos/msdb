package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.DriverPointsDetails;

import com.icesoft.msdb.repository.DriverPointsDetailsRepository;
import com.icesoft.msdb.repository.search.DriverPointsDetailsSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing DriverPointsDetails.
 */
@RestController
@RequestMapping("/api")
public class DriverPointsDetailsResource {

    private final Logger log = LoggerFactory.getLogger(DriverPointsDetailsResource.class);

    private static final String ENTITY_NAME = "driverPointsDetails";

    private final DriverPointsDetailsRepository driverPointsDetailsRepository;

    private final DriverPointsDetailsSearchRepository driverPointsDetailsSearchRepository;

    public DriverPointsDetailsResource(DriverPointsDetailsRepository driverPointsDetailsRepository, DriverPointsDetailsSearchRepository driverPointsDetailsSearchRepository) {
        this.driverPointsDetailsRepository = driverPointsDetailsRepository;
        this.driverPointsDetailsSearchRepository = driverPointsDetailsSearchRepository;
    }

    /**
     * POST  /driver-points-details : Create a new driverPointsDetails.
     *
     * @param driverPointsDetails the driverPointsDetails to create
     * @return the ResponseEntity with status 201 (Created) and with body the new driverPointsDetails, or with status 400 (Bad Request) if the driverPointsDetails has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/driver-points-details")
    @Timed
    public ResponseEntity<DriverPointsDetails> createDriverPointsDetails(@RequestBody DriverPointsDetails driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to save DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() != null) {
            throw new BadRequestAlertException("A new driverPointsDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DriverPointsDetails result = driverPointsDetailsRepository.save(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/driver-points-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /driver-points-details : Updates an existing driverPointsDetails.
     *
     * @param driverPointsDetails the driverPointsDetails to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated driverPointsDetails,
     * or with status 400 (Bad Request) if the driverPointsDetails is not valid,
     * or with status 500 (Internal Server Error) if the driverPointsDetails couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/driver-points-details")
    @Timed
    public ResponseEntity<DriverPointsDetails> updateDriverPointsDetails(@RequestBody DriverPointsDetails driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to update DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() == null) {
            return createDriverPointsDetails(driverPointsDetails);
        }
        DriverPointsDetails result = driverPointsDetailsRepository.save(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, driverPointsDetails.getId().toString()))
            .body(result);
    }

    /**
     * GET  /driver-points-details : get all the driverPointsDetails.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of driverPointsDetails in body
     */
    @GetMapping("/driver-points-details")
    @Timed
    public List<DriverPointsDetails> getAllDriverPointsDetails() {
        log.debug("REST request to get all DriverPointsDetails");
        return driverPointsDetailsRepository.findAll();
        }

    /**
     * GET  /driver-points-details/:id : get the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the driverPointsDetails, or with status 404 (Not Found)
     */
    @GetMapping("/driver-points-details/{id}")
    @Timed
    public ResponseEntity<DriverPointsDetails> getDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to get DriverPointsDetails : {}", id);
        DriverPointsDetails driverPointsDetails = driverPointsDetailsRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(driverPointsDetails));
    }

    /**
     * DELETE  /driver-points-details/:id : delete the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/driver-points-details/{id}")
    @Timed
    public ResponseEntity<Void> deleteDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to delete DriverPointsDetails : {}", id);
        driverPointsDetailsRepository.delete(id);
        driverPointsDetailsSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/driver-points-details?query=:query : search for the driverPointsDetails corresponding
     * to the query.
     *
     * @param query the query of the driverPointsDetails search
     * @return the result of the search
     */
    @GetMapping("/_search/driver-points-details")
    @Timed
    public List<DriverPointsDetails> searchDriverPointsDetails(@RequestParam String query) {
        log.debug("REST request to search DriverPointsDetails for query {}", query);
        return StreamSupport
            .stream(driverPointsDetailsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}

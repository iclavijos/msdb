package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.DriverPointsDetails;
import com.icesoft.msdb.repository.DriverPointsDetailsRepository;
import com.icesoft.msdb.repository.search.DriverPointsDetailsSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.DriverPointsDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DriverPointsDetailsResource {

    private final Logger log = LoggerFactory.getLogger(DriverPointsDetailsResource.class);

    private static final String ENTITY_NAME = "driverPointsDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DriverPointsDetailsRepository driverPointsDetailsRepository;

    private final DriverPointsDetailsSearchRepository driverPointsDetailsSearchRepository;

    public DriverPointsDetailsResource(DriverPointsDetailsRepository driverPointsDetailsRepository, DriverPointsDetailsSearchRepository driverPointsDetailsSearchRepository) {
        this.driverPointsDetailsRepository = driverPointsDetailsRepository;
        this.driverPointsDetailsSearchRepository = driverPointsDetailsSearchRepository;
    }

    /**
     * {@code POST  /driver-points-details} : Create a new driverPointsDetails.
     *
     * @param driverPointsDetails the driverPointsDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new driverPointsDetails, or with status {@code 400 (Bad Request)} if the driverPointsDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/driver-points-details")
    public ResponseEntity<DriverPointsDetails> createDriverPointsDetails(@RequestBody DriverPointsDetails driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to save DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() != null) {
            throw new BadRequestAlertException("A new driverPointsDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DriverPointsDetails result = driverPointsDetailsRepository.save(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/driver-points-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /driver-points-details} : Updates an existing driverPointsDetails.
     *
     * @param driverPointsDetails the driverPointsDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated driverPointsDetails,
     * or with status {@code 400 (Bad Request)} if the driverPointsDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the driverPointsDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/driver-points-details")
    public ResponseEntity<DriverPointsDetails> updateDriverPointsDetails(@RequestBody DriverPointsDetails driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to update DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DriverPointsDetails result = driverPointsDetailsRepository.save(driverPointsDetails);
        driverPointsDetailsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, driverPointsDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /driver-points-details} : get all the driverPointsDetails.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of driverPointsDetails in body.
     */
    @GetMapping("/driver-points-details")
    public List<DriverPointsDetails> getAllDriverPointsDetails() {
        log.debug("REST request to get all DriverPointsDetails");
        return driverPointsDetailsRepository.findAll();
    }

    /**
     * {@code GET  /driver-points-details/:id} : get the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the driverPointsDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/driver-points-details/{id}")
    public ResponseEntity<DriverPointsDetails> getDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to get DriverPointsDetails : {}", id);
        Optional<DriverPointsDetails> driverPointsDetails = driverPointsDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(driverPointsDetails);
    }

    /**
     * {@code DELETE  /driver-points-details/:id} : delete the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/driver-points-details/{id}")
    public ResponseEntity<Void> deleteDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to delete DriverPointsDetails : {}", id);
        driverPointsDetailsRepository.deleteById(id);
        driverPointsDetailsSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/driver-points-details?query=:query} : search for the driverPointsDetails corresponding
     * to the query.
     *
     * @param query the query of the driverPointsDetails search.
     * @return the result of the search.
     */
    @GetMapping("/_search/driver-points-details")
    public List<DriverPointsDetails> searchDriverPointsDetails(@RequestParam String query) {
        log.debug("REST request to search DriverPointsDetails for query {}", query);
        return StreamSupport
            .stream(driverPointsDetailsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.DriverEventPoints;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.web.rest.util.HeaderUtil;

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing DriverPointsDetails.
 */
@RestController
@RequestMapping("/api")
public class DriverPointsDetailsResource {

    private final Logger log = LoggerFactory.getLogger(DriverPointsDetailsResource.class);

    private static final String ENTITY_NAME = "driverPointsDetails";

    private final DriverEventPointsRepository driverPointsDetailsRepository;

    public DriverPointsDetailsResource(DriverEventPointsRepository driverPointsDetailsRepository) {
        this.driverPointsDetailsRepository = driverPointsDetailsRepository;
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
    public ResponseEntity<DriverEventPoints> createDriverPointsDetails(@RequestBody DriverEventPoints driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to save DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new driverPointsDetails cannot already have an ID")).body(null);
        }
        driverPointsDetails.setReason(driverPointsDetails.getSession().getName() + " - " + driverPointsDetails.getReason());
        DriverEventPoints result = driverPointsDetailsRepository.save(driverPointsDetails);
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
    public ResponseEntity<DriverEventPoints> updateDriverPointsDetails(@RequestBody DriverEventPoints driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to update DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() == null) {
            return createDriverPointsDetails(driverPointsDetails);
        }
        DriverEventPoints result = driverPointsDetailsRepository.save(driverPointsDetails);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, driverPointsDetails.getId().toString()))
            .body(result);
    }

    /**
     * GET  /driver-points-details/:id : get the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the driverPointsDetails, or with status 404 (Not Found)
     */
    @GetMapping("/driver-points-details/{id}")
    @Timed
    public ResponseEntity<DriverEventPoints> getDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to get DriverPointsDetails : {}", id);
        DriverEventPoints driverPointsDetails = driverPointsDetailsRepository.findOne(id);
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
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}

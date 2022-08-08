package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.DriverEventPoints;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.repository.jpa.DriverEventPointsRepository;
import com.icesoft.msdb.repository.jpa.EventSessionRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.DriverEventPoints}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DriverPointsDetailsResource {

    private final Logger log = LoggerFactory.getLogger(DriverPointsDetailsResource.class);

    private static final String ENTITY_NAME = "driverPointsDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DriverEventPointsRepository driverPointsDetailsRepository;
    private final EventSessionRepository eventSessionRepository;

    public DriverPointsDetailsResource(DriverEventPointsRepository driverPointsDetailsRepository, EventSessionRepository eventSessionRepository) {
        this.driverPointsDetailsRepository = driverPointsDetailsRepository;
        this.eventSessionRepository = eventSessionRepository;
    }

    /**
     * {@code POST  /driver-points-details} : Create a new driverPointsDetails.
     *
     * @param driverPointsDetails the driverPointsDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new driverPointsDetails, or with status {@code 400 (Bad Request)} if the driverPointsDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/driver-points-details")
    @CacheEvict(cacheNames="driversStandingsCache", key="#driverPointsDetails.session.id")
    public ResponseEntity<DriverEventPoints> createDriverPointsDetails(@RequestBody DriverEventPoints driverPointsDetails) throws URISyntaxException {
        log.debug("REST request to save DriverPointsDetails : {}", driverPointsDetails);
        if (driverPointsDetails.getId() != null) {
            throw new BadRequestAlertException("A new driverPointsDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventSession eventSession = eventSessionRepository.findById(driverPointsDetails.getSession().getId())
            .orElseThrow(() -> new MSDBException("Invalid session id " + driverPointsDetails.getSession().getId()));
        if (eventSession.getEventEdition().getSeriesEditions().size() == 1 ) {
            driverPointsDetails.setSeriesEdition(eventSession.getEventEdition().getSeriesEditions().stream().findFirst().get());
        }
        if (eventSession.getEventEdition().getAllowedCategories().size() == 1) {
            driverPointsDetails.setCategory(eventSession.getEventEdition().getAllowedCategories().stream().findFirst().get());
        }
        //TODO: Handle multi categories and multiseries
        driverPointsDetails.setReason(driverPointsDetails.getSession().getName() + " - " + driverPointsDetails.getReason());
        DriverEventPoints result = driverPointsDetailsRepository.save(driverPointsDetails);
        return ResponseEntity.created(new URI("/api/driver-points-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /driver-points-details/:id} : Updates an existing driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to save.
     * @param driverPointsDetails the driverPointsDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated driverPointsDetails,
     * or with status {@code 400 (Bad Request)} if the driverPointsDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the driverPointsDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/driver-points-details/{id}")
    public ResponseEntity<DriverEventPoints> updateDriverPointsDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DriverEventPoints driverPointsDetails
    ) throws URISyntaxException {
        log.debug("REST request to update DriverPointsDetails : {}, {}", id, driverPointsDetails);
        if (driverPointsDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DriverEventPoints result = driverPointsDetailsRepository.save(driverPointsDetails);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, driverPointsDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /driver-points-details/:id} : get the "id" driverPointsDetails.
     *
     * @param id the id of the driverPointsDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the driverPointsDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/driver-points-details/{id}")
    public ResponseEntity<DriverEventPoints> getDriverPointsDetails(@PathVariable Long id) {
        log.debug("REST request to get DriverPointsDetails : {}", id);
        Optional<DriverEventPoints> driverPointsDetails = driverPointsDetailsRepository.findById(id);
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
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

}

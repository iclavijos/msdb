package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.Chassis;
import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.repository.ChassisRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Chassis.
 */
@RestController
@RequestMapping("/api")
public class ChassisResource {

    private final Logger log = LoggerFactory.getLogger(ChassisResource.class);

    private static final String ENTITY_NAME = "chassis";
        
    private final ChassisRepository chassisRepository;
    
    private final CDNService cdnService;

    public ChassisResource(ChassisRepository chassisRepository, CDNService cdnService) {
        this.chassisRepository = chassisRepository;
        this.cdnService = cdnService;
    }

    /**
     * POST  /chassis : Create a new chassis.
     *
     * @param chassis the chassis to create
     * @return the ResponseEntity with status 201 (Created) and with body the new chassis, or with status 400 (Bad Request) if the chassis has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/chassis")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Chassis> createChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to save Chassis : {}", chassis);
        if (chassis.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new chassis cannot already have an ID")).body(null);
        }
        Chassis result = chassisRepository.save(chassis);
        
        if (chassis.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), chassis.getImage(), ENTITY_NAME);
			result.setImageUrl(cdnUrl);
			
			result = chassisRepository.save(result);
        }
        
        return ResponseEntity.created(new URI("/api/chassis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /chassis : Updates an existing chassis.
     *
     * @param chassis the chassis to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated chassis,
     * or with status 400 (Bad Request) if the chassis is not valid,
     * or with status 500 (Internal Server Error) if the chassis couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/chassis")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Chassis> updateChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to update Chassis : {}", chassis);
        if (chassis.getId() == null) {
            return createChassis(chassis);
        }
        
        if (chassis.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(chassis.getId().toString(), chassis.getImage(), ENTITY_NAME);
	        chassis.setImageUrl(cdnUrl);
        } else {
        	cdnService.deleteImage(chassis.getId().toString(), ENTITY_NAME);
        }
        
        Chassis result = chassisRepository.save(chassis);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, chassis.getId().toString()))
            .body(result);
    }

    /**
     * GET  /chassis : get all the chassis.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of chassis in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/chassis")
    @Timed
    public ResponseEntity<List<Chassis>> getAllChassis(@ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Chassis");
        Page<Chassis> page = chassisRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/chassis");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /chassis/:id : get the "id" chassis.
     *
     * @param id the id of the chassis to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chassis, or with status 404 (Not Found)
     */
    @GetMapping("/chassis/{id}")
    @Timed
    public ResponseEntity<Chassis> getChassis(@PathVariable Long id) {
        log.debug("REST request to get Chassis : {}", id);
        Chassis chassis = chassisRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(chassis));
    }

    /**
     * DELETE  /chassis/:id : delete the "id" chassis.
     *
     * @param id the id of the chassis to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/chassis/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteChassis(@PathVariable Long id) {
        log.debug("REST request to delete Chassis : {}", id);
        chassisRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/chassis?query=:query : search for the chassis corresponding
     * to the query.
     *
     * @param query the query of the chassis search 
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/chassis")
    @Timed
    public ResponseEntity<List<Chassis>> searchChassis(@RequestParam String query, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = chassisRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/chassis");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_typeahead/chassis")
    @Timed
    public List<Chassis> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = chassisRepository.search(query, null);
        return page.getContent();
    }
}

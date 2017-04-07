package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
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
import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.Statistics;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.StatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.dto.DriverFullNameDTO;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import com.icesoft.msdb.web.rest.view.View;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Driver.
 */
@RestController
@RequestMapping("/api")
public class DriverResource {

    private final Logger log = LoggerFactory.getLogger(DriverResource.class);

    private static final String ENTITY_NAME = "driver";
        
    private final DriverRepository driverRepository;
    
    private final StatisticsRepository statsRepo;

    private final CDNService cdnService;

    public DriverResource(DriverRepository driverRepository, StatisticsRepository statsRepo, CDNService cdnService) {
        this.driverRepository = driverRepository;
        this.statsRepo = statsRepo;
        this.cdnService = cdnService;
    }

    /**
     * POST  /drivers : Create a new driver.
     *
     * @param driver the driver to create
     * @return the ResponseEntity with status 201 (Created) and with body the new driver, or with status 400 (Bad Request) if the driver has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/drivers")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Driver> createDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to save Driver : {}", driver);
        if (driver.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new driver cannot already have an ID")).body(null);
        }
        
        Driver result = driverRepository.save(driver);
        if (driver.getPortrait() != null) {
	        String cdnUrl = cdnService.uploadImage(driver.getId().toString(), driver.getPortrait(), ENTITY_NAME);
			driver.portraitUrl(cdnUrl);
			
			result = driverRepository.save(driver);
        }
        
        return ResponseEntity.created(new URI("/api/drivers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);

    }

    /**
     * PUT  /drivers : Updates an existing driver.
     *
     * @param driver the driver to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated driver,
     * or with status 400 (Bad Request) if the driver is not valid,
     * or with status 500 (Internal Server Error) if the driver couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/drivers")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Driver> updateDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to update Driver : {}", driver);
        if (driver.getId() == null) {
            return createDriver(driver);
        }
        if (driver.getPortrait() != null) {
	        String cdnUrl = cdnService.uploadImage(driver.getId().toString(), driver.getPortrait(), ENTITY_NAME);
	        driver.setPortraitUrl(cdnUrl);
        } else {
        	cdnService.deleteImage(driver.getId().toString(), ENTITY_NAME);
        }
        Driver result = driverRepository.save(driver);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, driver.getId().toString()))
            .body(result);
    }

    /**
     * GET  /drivers : get all the drivers.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of drivers in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/drivers")
    @Timed
    public ResponseEntity<List<Driver>> getAllDrivers(@ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Drivers");
        Page<Driver> page = driverRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/drivers");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /drivers/:id : get the "id" driver.
     *
     * @param id the id of the driver to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the driver, or with status 404 (Not Found)
     */
    @GetMapping("/drivers/{id}")
    @Timed
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        log.debug("REST request to get Driver : {}", id);
        Driver driver = driverRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(driver));
    }
    
    /**
     * 
     */
    @GetMapping("/drivers/{id}/statistics")
    @Timed
    public ResponseEntity<Statistics> getDriverStatistics(@PathVariable Long id) {
    	log.debug("REST request to get statistics for driver : {}", id);
    	Statistics stats = statsRepo.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(stats));
    }

    /**
     * DELETE  /drivers/:id : delete the "id" driver.
     *
     * @param id the id of the driver to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/drivers/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        log.debug("REST request to delete Driver : {}", id);
        driverRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/drivers?query=:query : search for the driver corresponding
     * to the query.
     *
     * @param query the query of the driver search 
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/drivers")
    @Timed
    public ResponseEntity<List<Driver>> searchDrivers(@RequestParam String query, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Drivers for query '{}'", query);
        Page<Driver> page = driverRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/drivers");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_typeahead/drivers")
    @Timed
    //@JsonView(View.Summary.class)
    public ResponseEntity<List<DriverFullNameDTO>> typeahead(@RequestParam String query)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Drivers for query '{}'", query);
        List<Driver> page = driverRepository.searchNonPageable(query);
        if (page.size() > 20) {
        	page = page.subList(0, 20);
        }
        List<DriverFullNameDTO> result = new ArrayList<>();
        for (Driver driver : page) {
			result.add(new DriverFullNameDTO(driver));
		}
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}

package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.search.DriverSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.Driver}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DriverResource {

    private final Logger log = LoggerFactory.getLogger(DriverResource.class);

    private static final String ENTITY_NAME = "driver";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DriverRepository driverRepository;

    private final DriverSearchRepository driverSearchRepository;

    public DriverResource(DriverRepository driverRepository, DriverSearchRepository driverSearchRepository) {
        this.driverRepository = driverRepository;
        this.driverSearchRepository = driverSearchRepository;
    }

    /**
     * {@code POST  /drivers} : Create a new driver.
     *
     * @param driver the driver to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new driver, or with status {@code 400 (Bad Request)} if the driver has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/drivers")
    public ResponseEntity<Driver> createDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to save Driver : {}", driver);
        if (driver.getId() != null) {
            throw new BadRequestAlertException("A new driver cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Driver result = driverRepository.save(driver);
        driverSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/drivers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /drivers} : Updates an existing driver.
     *
     * @param driver the driver to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated driver,
     * or with status {@code 400 (Bad Request)} if the driver is not valid,
     * or with status {@code 500 (Internal Server Error)} if the driver couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/drivers")
    public ResponseEntity<Driver> updateDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to update Driver : {}", driver);
        if (driver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Driver result = driverRepository.save(driver);
        driverSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, driver.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /drivers} : get all the drivers.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of drivers in body.
     */
    @GetMapping("/drivers")
    public ResponseEntity<List<Driver>> getAllDrivers(Pageable pageable) {
        log.debug("REST request to get a page of Drivers");
        Page<Driver> page = driverRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /drivers/:id} : get the "id" driver.
     *
     * @param id the id of the driver to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the driver, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/drivers/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        log.debug("REST request to get Driver : {}", id);
        Optional<Driver> driver = driverRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(driver);
    }

    /**
     * {@code DELETE  /drivers/:id} : delete the "id" driver.
     *
     * @param id the id of the driver to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        log.debug("REST request to delete Driver : {}", id);
        driverRepository.deleteById(id);
        driverSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/drivers?query=:query} : search for the driver corresponding
     * to the query.
     *
     * @param query the query of the driver search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/drivers")
    public ResponseEntity<List<Driver>> searchDrivers(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Drivers for query {}", query);
        Page<Driver> page = driverSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

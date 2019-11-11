package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Chassis;
import com.icesoft.msdb.repository.ChassisRepository;
import com.icesoft.msdb.repository.search.ChassisSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.Chassis}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChassisResource {

    private final Logger log = LoggerFactory.getLogger(ChassisResource.class);

    private static final String ENTITY_NAME = "chassis";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChassisRepository chassisRepository;

    private final ChassisSearchRepository chassisSearchRepository;

    public ChassisResource(ChassisRepository chassisRepository, ChassisSearchRepository chassisSearchRepository) {
        this.chassisRepository = chassisRepository;
        this.chassisSearchRepository = chassisSearchRepository;
    }

    /**
     * {@code POST  /chassis} : Create a new chassis.
     *
     * @param chassis the chassis to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chassis, or with status {@code 400 (Bad Request)} if the chassis has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chassis")
    public ResponseEntity<Chassis> createChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to save Chassis : {}", chassis);
        if (chassis.getId() != null) {
            throw new BadRequestAlertException("A new chassis cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chassis result = chassisRepository.save(chassis);
        chassisSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/chassis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chassis} : Updates an existing chassis.
     *
     * @param chassis the chassis to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chassis,
     * or with status {@code 400 (Bad Request)} if the chassis is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chassis couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chassis")
    public ResponseEntity<Chassis> updateChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to update Chassis : {}", chassis);
        if (chassis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Chassis result = chassisRepository.save(chassis);
        chassisSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chassis.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /chassis} : get all the chassis.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chassis in body.
     */
    @GetMapping("/chassis")
    public ResponseEntity<List<Chassis>> getAllChassis(Pageable pageable) {
        log.debug("REST request to get a page of Chassis");
        Page<Chassis> page = chassisRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chassis/:id} : get the "id" chassis.
     *
     * @param id the id of the chassis to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chassis, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chassis/{id}")
    public ResponseEntity<Chassis> getChassis(@PathVariable Long id) {
        log.debug("REST request to get Chassis : {}", id);
        Optional<Chassis> chassis = chassisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chassis);
    }

    /**
     * {@code DELETE  /chassis/:id} : delete the "id" chassis.
     *
     * @param id the id of the chassis to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chassis/{id}")
    public ResponseEntity<Void> deleteChassis(@PathVariable Long id) {
        log.debug("REST request to delete Chassis : {}", id);
        chassisRepository.deleteById(id);
        chassisSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/chassis?query=:query} : search for the chassis corresponding
     * to the query.
     *
     * @param query the query of the chassis search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/chassis")
    public ResponseEntity<List<Chassis>> searchChassis(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = chassisSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

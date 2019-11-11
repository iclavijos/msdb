package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.FuelProvider;
import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.repository.search.FuelProviderSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.FuelProvider}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FuelProviderResource {

    private final Logger log = LoggerFactory.getLogger(FuelProviderResource.class);

    private static final String ENTITY_NAME = "fuelProvider";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FuelProviderRepository fuelProviderRepository;

    private final FuelProviderSearchRepository fuelProviderSearchRepository;

    public FuelProviderResource(FuelProviderRepository fuelProviderRepository, FuelProviderSearchRepository fuelProviderSearchRepository) {
        this.fuelProviderRepository = fuelProviderRepository;
        this.fuelProviderSearchRepository = fuelProviderSearchRepository;
    }

    /**
     * {@code POST  /fuel-providers} : Create a new fuelProvider.
     *
     * @param fuelProvider the fuelProvider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fuelProvider, or with status {@code 400 (Bad Request)} if the fuelProvider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fuel-providers")
    public ResponseEntity<FuelProvider> createFuelProvider(@Valid @RequestBody FuelProvider fuelProvider) throws URISyntaxException {
        log.debug("REST request to save FuelProvider : {}", fuelProvider);
        if (fuelProvider.getId() != null) {
            throw new BadRequestAlertException("A new fuelProvider cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/fuel-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fuel-providers} : Updates an existing fuelProvider.
     *
     * @param fuelProvider the fuelProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fuelProvider,
     * or with status {@code 400 (Bad Request)} if the fuelProvider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fuelProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fuel-providers")
    public ResponseEntity<FuelProvider> updateFuelProvider(@Valid @RequestBody FuelProvider fuelProvider) throws URISyntaxException {
        log.debug("REST request to update FuelProvider : {}", fuelProvider);
        if (fuelProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fuelProvider.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /fuel-providers} : get all the fuelProviders.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fuelProviders in body.
     */
    @GetMapping("/fuel-providers")
    public ResponseEntity<List<FuelProvider>> getAllFuelProviders(Pageable pageable) {
        log.debug("REST request to get a page of FuelProviders");
        Page<FuelProvider> page = fuelProviderRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fuel-providers/:id} : get the "id" fuelProvider.
     *
     * @param id the id of the fuelProvider to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fuelProvider, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fuel-providers/{id}")
    public ResponseEntity<FuelProvider> getFuelProvider(@PathVariable Long id) {
        log.debug("REST request to get FuelProvider : {}", id);
        Optional<FuelProvider> fuelProvider = fuelProviderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fuelProvider);
    }

    /**
     * {@code DELETE  /fuel-providers/:id} : delete the "id" fuelProvider.
     *
     * @param id the id of the fuelProvider to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fuel-providers/{id}")
    public ResponseEntity<Void> deleteFuelProvider(@PathVariable Long id) {
        log.debug("REST request to delete FuelProvider : {}", id);
        fuelProviderRepository.deleteById(id);
        fuelProviderSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/fuel-providers?query=:query} : search for the fuelProvider corresponding
     * to the query.
     *
     * @param query the query of the fuelProvider search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/fuel-providers")
    public ResponseEntity<List<FuelProvider>> searchFuelProviders(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of FuelProviders for query {}", query);
        Page<FuelProvider> page = fuelProviderSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

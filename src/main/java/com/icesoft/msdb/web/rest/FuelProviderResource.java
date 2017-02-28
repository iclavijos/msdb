package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.FuelProvider;

import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.repository.search.FuelProviderSearchRepository;
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
 * REST controller for managing FuelProvider.
 */
@RestController
@RequestMapping("/api")
public class FuelProviderResource {

    private final Logger log = LoggerFactory.getLogger(FuelProviderResource.class);

    private static final String ENTITY_NAME = "fuelProvider";
        
    private final FuelProviderRepository fuelProviderRepository;

    private final FuelProviderSearchRepository fuelProviderSearchRepository;

    public FuelProviderResource(FuelProviderRepository fuelProviderRepository, FuelProviderSearchRepository fuelProviderSearchRepository) {
        this.fuelProviderRepository = fuelProviderRepository;
        this.fuelProviderSearchRepository = fuelProviderSearchRepository;
    }

    /**
     * POST  /fuel-providers : Create a new fuelProvider.
     *
     * @param fuelProvider the fuelProvider to create
     * @return the ResponseEntity with status 201 (Created) and with body the new fuelProvider, or with status 400 (Bad Request) if the fuelProvider has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/fuel-providers")
    @Timed
    public ResponseEntity<FuelProvider> createFuelProvider(@Valid @RequestBody FuelProvider fuelProvider) throws URISyntaxException {
        log.debug("REST request to save FuelProvider : {}", fuelProvider);
        if (fuelProvider.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new fuelProvider cannot already have an ID")).body(null);
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/fuel-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /fuel-providers : Updates an existing fuelProvider.
     *
     * @param fuelProvider the fuelProvider to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated fuelProvider,
     * or with status 400 (Bad Request) if the fuelProvider is not valid,
     * or with status 500 (Internal Server Error) if the fuelProvider couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/fuel-providers")
    @Timed
    public ResponseEntity<FuelProvider> updateFuelProvider(@Valid @RequestBody FuelProvider fuelProvider) throws URISyntaxException {
        log.debug("REST request to update FuelProvider : {}", fuelProvider);
        if (fuelProvider.getId() == null) {
            return createFuelProvider(fuelProvider);
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, fuelProvider.getId().toString()))
            .body(result);
    }

    /**
     * GET  /fuel-providers : get all the fuelProviders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of fuelProviders in body
     */
    @GetMapping("/fuel-providers")
    @Timed
    public List<FuelProvider> getAllFuelProviders() {
        log.debug("REST request to get all FuelProviders");
        List<FuelProvider> fuelProviders = fuelProviderRepository.findAll();
        return fuelProviders;
    }

    /**
     * GET  /fuel-providers/:id : get the "id" fuelProvider.
     *
     * @param id the id of the fuelProvider to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the fuelProvider, or with status 404 (Not Found)
     */
    @GetMapping("/fuel-providers/{id}")
    @Timed
    public ResponseEntity<FuelProvider> getFuelProvider(@PathVariable Long id) {
        log.debug("REST request to get FuelProvider : {}", id);
        FuelProvider fuelProvider = fuelProviderRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(fuelProvider));
    }

    /**
     * DELETE  /fuel-providers/:id : delete the "id" fuelProvider.
     *
     * @param id the id of the fuelProvider to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/fuel-providers/{id}")
    @Timed
    public ResponseEntity<Void> deleteFuelProvider(@PathVariable Long id) {
        log.debug("REST request to delete FuelProvider : {}", id);
        fuelProviderRepository.delete(id);
        fuelProviderSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/fuel-providers?query=:query : search for the fuelProvider corresponding
     * to the query.
     *
     * @param query the query of the fuelProvider search 
     * @return the result of the search
     */
    @GetMapping("/_search/fuel-providers")
    @Timed
    public List<FuelProvider> searchFuelProviders(@RequestParam String query) {
        log.debug("REST request to search FuelProviders for query {}", query);
        return StreamSupport
            .stream(fuelProviderSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}

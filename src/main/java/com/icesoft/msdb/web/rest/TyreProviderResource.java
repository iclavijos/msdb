package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.TyreProvider;
import com.icesoft.msdb.repository.TyreProviderRepository;
import com.icesoft.msdb.web.rest.util.HeaderUtil;

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing TyreProvider.
 */
@RestController
@RequestMapping("/api")
public class TyreProviderResource {

    private final Logger log = LoggerFactory.getLogger(TyreProviderResource.class);

    private static final String ENTITY_NAME = "tyreProvider";
        
    private final TyreProviderRepository tyreProviderRepository;

    public TyreProviderResource(TyreProviderRepository tyreProviderRepository) {
        this.tyreProviderRepository = tyreProviderRepository;
    }

    /**
     * POST  /tyre-providers : Create a new tyreProvider.
     *
     * @param tyreProvider the tyreProvider to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tyreProvider, or with status 400 (Bad Request) if the tyreProvider has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tyre-providers")
    @Timed
    public ResponseEntity<TyreProvider> createTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to save TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new tyreProvider cannot already have an ID")).body(null);
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        return ResponseEntity.created(new URI("/api/tyre-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tyre-providers : Updates an existing tyreProvider.
     *
     * @param tyreProvider the tyreProvider to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tyreProvider,
     * or with status 400 (Bad Request) if the tyreProvider is not valid,
     * or with status 500 (Internal Server Error) if the tyreProvider couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tyre-providers")
    @Timed
    public ResponseEntity<TyreProvider> updateTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to update TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() == null) {
            return createTyreProvider(tyreProvider);
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tyreProvider.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tyre-providers : get all the tyreProviders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tyreProviders in body
     */
    @GetMapping("/tyre-providers")
    @Timed
    public List<TyreProvider> getAllTyreProviders() {
        log.debug("REST request to get all TyreProviders");
        List<TyreProvider> tyreProviders = tyreProviderRepository.findAll();
        return tyreProviders;
    }

    /**
     * GET  /tyre-providers/:id : get the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tyreProvider, or with status 404 (Not Found)
     */
    @GetMapping("/tyre-providers/{id}")
    @Timed
    public ResponseEntity<TyreProvider> getTyreProvider(@PathVariable Long id) {
        log.debug("REST request to get TyreProvider : {}", id);
        TyreProvider tyreProvider = tyreProviderRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tyreProvider));
    }

    /**
     * DELETE  /tyre-providers/:id : delete the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tyre-providers/{id}")
    @Timed
    public ResponseEntity<Void> deleteTyreProvider(@PathVariable Long id) {
        log.debug("REST request to delete TyreProvider : {}", id);
        tyreProviderRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tyre-providers?query=:query : search for the tyreProvider corresponding
     * to the query.
     *
     * @param query the query of the tyreProvider search 
     * @return the result of the search
     */
    @GetMapping("/_search/tyre-providers")
    @Timed
    public List<TyreProvider> searchTyreProviders(@RequestParam String query) {
        log.debug("REST request to search TyreProviders for query {}", query);
        return tyreProviderRepository.search(query);
    }


}

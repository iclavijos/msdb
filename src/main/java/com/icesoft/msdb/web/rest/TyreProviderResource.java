package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.TyreProvider;
import com.icesoft.msdb.repository.TyreProviderRepository;
import com.icesoft.msdb.repository.search.TyreProviderSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.TyreProvider}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TyreProviderResource {

    private final Logger log = LoggerFactory.getLogger(TyreProviderResource.class);

    private static final String ENTITY_NAME = "tyreProvider";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TyreProviderRepository tyreProviderRepository;

    private final TyreProviderSearchRepository tyreProviderSearchRepository;

    public TyreProviderResource(TyreProviderRepository tyreProviderRepository, TyreProviderSearchRepository tyreProviderSearchRepository) {
        this.tyreProviderRepository = tyreProviderRepository;
        this.tyreProviderSearchRepository = tyreProviderSearchRepository;
    }

    /**
     * {@code POST  /tyre-providers} : Create a new tyreProvider.
     *
     * @param tyreProvider the tyreProvider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tyreProvider, or with status {@code 400 (Bad Request)} if the tyreProvider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tyre-providers")
    public ResponseEntity<TyreProvider> createTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to save TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() != null) {
            throw new BadRequestAlertException("A new tyreProvider cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        tyreProviderSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tyre-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tyre-providers} : Updates an existing tyreProvider.
     *
     * @param tyreProvider the tyreProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tyreProvider,
     * or with status {@code 400 (Bad Request)} if the tyreProvider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tyreProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tyre-providers")
    public ResponseEntity<TyreProvider> updateTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to update TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        tyreProviderSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tyreProvider.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tyre-providers} : get all the tyreProviders.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tyreProviders in body.
     */
    @GetMapping("/tyre-providers")
    public ResponseEntity<List<TyreProvider>> getAllTyreProviders(Pageable pageable) {
        log.debug("REST request to get a page of TyreProviders");
        Page<TyreProvider> page = tyreProviderRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /tyre-providers/:id} : get the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tyreProvider, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tyre-providers/{id}")
    public ResponseEntity<TyreProvider> getTyreProvider(@PathVariable Long id) {
        log.debug("REST request to get TyreProvider : {}", id);
        Optional<TyreProvider> tyreProvider = tyreProviderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tyreProvider);
    }

    /**
     * {@code DELETE  /tyre-providers/:id} : delete the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tyre-providers/{id}")
    public ResponseEntity<Void> deleteTyreProvider(@PathVariable Long id) {
        log.debug("REST request to delete TyreProvider : {}", id);
        tyreProviderRepository.deleteById(id);
        tyreProviderSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/tyre-providers?query=:query} : search for the tyreProvider corresponding
     * to the query.
     *
     * @param query the query of the tyreProvider search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/tyre-providers")
    public ResponseEntity<List<TyreProvider>> searchTyreProviders(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of TyreProviders for query {}", query);
        Page<TyreProvider> page = tyreProviderSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

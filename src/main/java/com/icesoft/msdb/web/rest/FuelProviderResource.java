package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.FuelProvider;

import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.repository.search.FuelProviderSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import org.springframework.data.domain.PageRequest;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
    private final SearchService searchService;

    private final CDNService cdnService;

    public FuelProviderResource(FuelProviderRepository fuelProviderRepository, FuelProviderSearchRepository fuelProviderSearchRepository,
                                CDNService cdnService, SearchService searchService) {
        this.fuelProviderRepository = fuelProviderRepository;
        this.fuelProviderSearchRepository = fuelProviderSearchRepository;
        this.cdnService = cdnService;
        this.searchService = searchService;
    }

    /**
     * {@code POST  /fuel-providers} : Create a new fuelProvider.
     *
     * @param fuelProvider the fuelProvider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fuelProvider, or with status {@code 400 (Bad Request)} if the fuelProvider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fuel-providers")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<FuelProvider> createFuelProvider(@Valid @RequestBody FuelProvider fuelProvider) throws URISyntaxException {
        log.debug("REST request to save FuelProvider : {}", fuelProvider);
        if (fuelProvider.getId() != null) {
            throw new BadRequestAlertException("A new fuelProvider cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        if (fuelProvider.getLogo() != null) {
            String cdnUrl = cdnService.uploadImage(result.getId().toString(), fuelProvider.getLogo(), ENTITY_NAME);
            fuelProvider.logoUrl(cdnUrl);

            result = fuelProviderRepository.save(result);
        }

        return ResponseEntity
            .created(new URI("/api/fuel-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fuel-providers/:id} : Updates an existing fuelProvider.
     *
     * @param id the id of the fuelProvider to save.
     * @param fuelProvider the fuelProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fuelProvider,
     * or with status {@code 400 (Bad Request)} if the fuelProvider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fuelProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fuel-providers/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<FuelProvider> updateFuelProvider(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FuelProvider fuelProvider
    ) throws URISyntaxException {
        log.debug("REST request to update FuelProvider : {}, {}", id, fuelProvider);
        if (fuelProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fuelProvider.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fuelProviderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (fuelProvider.getLogo() != null) {
            String cdnUrl = cdnService.uploadImage(fuelProvider.getId().toString(), fuelProvider.getLogo(), ENTITY_NAME);
            fuelProvider.logoUrl(cdnUrl);
        } else if (fuelProvider.getLogoUrl() == null) {
            cdnService.deleteImage(fuelProvider.getId().toString(), ENTITY_NAME);
        }
        FuelProvider result = fuelProviderRepository.save(fuelProvider);
        fuelProviderSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fuelProvider.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fuel-providers/:id} : Partial updates given fields of an existing fuelProvider, field will ignore if it is null
     *
     * @param id the id of the fuelProvider to save.
     * @param fuelProvider the fuelProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fuelProvider,
     * or with status {@code 400 (Bad Request)} if the fuelProvider is not valid,
     * or with status {@code 404 (Not Found)} if the fuelProvider is not found,
     * or with status {@code 500 (Internal Server Error)} if the fuelProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fuel-providers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FuelProvider> partialUpdateFuelProvider(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FuelProvider fuelProvider
    ) throws URISyntaxException {
        log.debug("REST request to partial update FuelProvider partially : {}, {}", id, fuelProvider);
        if (fuelProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fuelProvider.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fuelProviderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FuelProvider> result = fuelProviderRepository
            .findById(fuelProvider.getId())
            .map(existingFuelProvider -> {
                if (fuelProvider.getName() != null) {
                    existingFuelProvider.setName(fuelProvider.getName());
                }
                if (fuelProvider.getLogo() != null) {
                    existingFuelProvider.setLogo(fuelProvider.getLogo());
                }
                return existingFuelProvider;
            })
            .map(fuelProviderRepository::save)
            .map(savedFuelProvider -> {
                fuelProviderSearchRepository.save(savedFuelProvider);

                return savedFuelProvider;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fuelProvider.getId().toString())
        );
    }

    /**
     * {@code GET  /fuel-providers} : get all the fuelProviders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fuelProviders in body.
     */
    @GetMapping("/fuel-providers")
    public ResponseEntity<List<FuelProvider>> getFuelProviders(Pageable pageable) {
        log.debug("REST request to get a page of FuelProviders");
        List<FuelProvider> allFuelProviders = fuelProviderRepository.findAll(pageable.getSort());
        return ResponseEntity.ok(allFuelProviders);
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
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteFuelProvider(@PathVariable Long id) {
        log.debug("REST request to delete FuelProvider : {}", id);
        fuelProviderRepository.deleteById(id);
        fuelProviderSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
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
        Page<FuelProvider> page = searchService.performWildcardSearch(
            FuelProvider.class,
            query,
            Arrays.asList("name"),
            pageable
        );
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity
            .ok().headers(headers)
            .body(page.getContent());
    }

    @GetMapping("/_typeahead/fuels")
    public List<FuelProvider> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of FuelProvider for query {}", query);

        Page<FuelProvider> page = searchService.performWildcardSearch(
            FuelProvider.class,
            query,
            Arrays.asList("name"),
            PageRequest.of(0, 20)
        );
        return page.getContent();
    }
}

package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.TyreProvider;
import com.icesoft.msdb.repository.jpa.TyreProviderRepository;
import com.icesoft.msdb.repository.search.TyreProviderSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

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
    private final SearchService searchService;

    private final CDNService cdnService;

    public TyreProviderResource(TyreProviderRepository tyreProviderRepository, TyreProviderSearchRepository tyreProviderSearchRepository,
    		CDNService cdnService, SearchService searchService) {
        this.tyreProviderRepository = tyreProviderRepository;
        this.tyreProviderSearchRepository = tyreProviderSearchRepository;
        this.cdnService = cdnService;
        this.searchService = searchService;
    }

    /**
     * {@code POST  /tyre-providers} : Create a new tyreProvider.
     *
     * @param tyreProvider the tyreProvider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tyreProvider, or with status {@code 400 (Bad Request)} if the tyreProvider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tyre-providers")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<TyreProvider> createTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to save TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() != null) {
            throw new BadRequestAlertException("A new tyreProvider cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        tyreProviderSearchRepository.save(result);
        if (tyreProvider.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), tyreProvider.getLogo(), ENTITY_NAME);
	        tyreProvider.setLogoUrl(cdnUrl);

			result = tyreProviderRepository.save(result);
        }

        return ResponseEntity
            .created(new URI("/api/tyre-providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tyre-providers/:id} : Updates an existing tyreProvider.
     *
     * @param id the id of the tyreProvider to save.
     * @param tyreProvider the tyreProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tyreProvider,
     * or with status {@code 400 (Bad Request)} if the tyreProvider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tyreProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tyre-providers/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<TyreProvider> updateTyreProvider(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TyreProvider tyreProvider
    ) throws URISyntaxException {
        log.debug("REST request to update TyreProvider : {}, {}", id, tyreProvider);
        if (tyreProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tyreProvider.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tyreProviderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (tyreProvider.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(tyreProvider.getId().toString(), tyreProvider.getLogo(), ENTITY_NAME);
        	tyreProvider.setLogoUrl(cdnUrl);
        } else if (tyreProvider.getLogoUrl() == null) {
        	cdnService.deleteImage(tyreProvider.getId().toString(), ENTITY_NAME);
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        tyreProviderSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tyreProvider.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tyre-providers/:id} : Partial updates given fields of an existing tyreProvider, field will ignore if it is null
     *
     * @param id the id of the tyreProvider to save.
     * @param tyreProvider the tyreProvider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tyreProvider,
     * or with status {@code 400 (Bad Request)} if the tyreProvider is not valid,
     * or with status {@code 404 (Not Found)} if the tyreProvider is not found,
     * or with status {@code 500 (Internal Server Error)} if the tyreProvider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tyre-providers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TyreProvider> partialUpdateTyreProvider(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TyreProvider tyreProvider
    ) throws URISyntaxException {
        log.debug("REST request to partial update TyreProvider partially : {}, {}", id, tyreProvider);
        if (tyreProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tyreProvider.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tyreProviderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TyreProvider> result = tyreProviderRepository
            .findById(tyreProvider.getId())
            .map(existingTyreProvider -> {
                if (tyreProvider.getName() != null) {
                    existingTyreProvider.setName(tyreProvider.getName());
                }
                if (tyreProvider.getLogo() != null) {
                    existingTyreProvider.setLogo(tyreProvider.getLogo());
                }
                if (tyreProvider.getLetterColor() != null) {
                    existingTyreProvider.setLetterColor(tyreProvider.getLetterColor());
                }
                if (tyreProvider.getBackgroundColor() != null) {
                    existingTyreProvider.setBackgroundColor(tyreProvider.getBackgroundColor());
                }

                return existingTyreProvider;
            })
            .map(tyreProviderRepository::save)
            .map(savedTyreProvider -> {
                tyreProviderSearchRepository.save(savedTyreProvider);

                return savedTyreProvider;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tyreProvider.getId().toString())
        );
    }

    /**
     * {@code GET  /tyre-providers} : get all the tyreProviders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tyreProviders in body.
     */
    @GetMapping("/tyre-providers")
    public ResponseEntity<List<TyreProvider>> getTyreProviders(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to get a page of TyreProviders");
        Page<TyreProvider> page;
        if (!StringUtils.isBlank(query)) {
            page = searchService.performWildcardSearch(
                TyreProvider.class,
                query.toLowerCase(),
                Arrays.asList("name"),
                pageable);
        } else {
            page = tyreProviderRepository.findAll(pageable);
        }
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
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteTyreProvider(@PathVariable Long id) {
        log.debug("REST request to delete TyreProvider : {}", id);
        tyreProviderRepository.deleteById(id);
        tyreProviderSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
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
        Page<TyreProvider> page = searchService.performWildcardSearch(
            TyreProvider.class,
            query.toLowerCase(),
            Arrays.asList("name"),
            pageable
        );
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity
            .ok().headers(headers)
            .body(page.getContent());
    }

    @GetMapping("/_typeahead/tyres")
    public List<TyreProvider> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of TyreProvider for query {}", query);

        Page<TyreProvider> page = searchService.performWildcardSearch(
            TyreProvider.class,
            query.toLowerCase(),
            Arrays.asList("name"),
            PageRequest.of(0, 10)
        );
        return page.getContent();
    }
}

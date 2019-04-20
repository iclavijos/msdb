package com.icesoft.msdb.web.rest;
import com.icesoft.msdb.domain.TyreProvider;

import com.icesoft.msdb.repository.TyreProviderRepository;
import com.icesoft.msdb.repository.search.TyreProviderSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
 * REST controller for managing TyreProvider.
 */
@RestController
@RequestMapping("/api")
public class TyreProviderResource {

    private final Logger log = LoggerFactory.getLogger(TyreProviderResource.class);

    private static final String ENTITY_NAME = "tyreProvider";

    private final TyreProviderRepository tyreProviderRepository;

    private final TyreProviderSearchRepository tyreProviderSearchRepository;

    private final CDNService cdnService;

    public TyreProviderResource(TyreProviderRepository tyreProviderRepository, TyreProviderSearchRepository tyreProviderSearchRepository,
    		CDNService cdnService) {
        this.tyreProviderRepository = tyreProviderRepository;
        this.tyreProviderSearchRepository = tyreProviderSearchRepository;
        this.cdnService = cdnService;
    }

    /**
     * POST  /tyre-providers : Create a new tyreProvider.
     *
     * @param tyreProvider the tyreProvider to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tyreProvider, or with status 400 (Bad Request) if the tyreProvider has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
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
	        tyreProvider.logoUrl(cdnUrl);

			result = tyreProviderRepository.save(result);
        }

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
     * or with status 500 (Internal Server Error) if the tyreProvider couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tyre-providers")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<TyreProvider> updateTyreProvider(@Valid @RequestBody TyreProvider tyreProvider) throws URISyntaxException {
        log.debug("REST request to update TyreProvider : {}", tyreProvider);
        if (tyreProvider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (tyreProvider.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(tyreProvider.getId().toString(), tyreProvider.getLogo(), ENTITY_NAME);
        	tyreProvider.logoUrl(cdnUrl);
        } else if (tyreProvider.getLogoUrl() == null) {
        	cdnService.deleteImage(tyreProvider.getId().toString(), ENTITY_NAME);
        }
        TyreProvider result = tyreProviderRepository.save(tyreProvider);
        tyreProviderSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tyreProvider.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tyre-providers : get all the tyreProviders.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tyreProviders in body
     */
    @GetMapping("/tyre-providers")
    public ResponseEntity<List<TyreProvider>> getAllTyreProviders(Pageable pageable) {
        log.debug("REST request to get a page of TyreProviders");
        Page<TyreProvider> page = tyreProviderRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tyre-providers");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /tyre-providers/:id : get the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tyreProvider, or with status 404 (Not Found)
     */
    @GetMapping("/tyre-providers/{id}")
    public ResponseEntity<TyreProvider> getTyreProvider(@PathVariable Long id) {
        log.debug("REST request to get TyreProvider : {}", id);
        Optional<TyreProvider> tyreProvider = tyreProviderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tyreProvider);
    }

    /**
     * DELETE  /tyre-providers/:id : delete the "id" tyreProvider.
     *
     * @param id the id of the tyreProvider to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tyre-providers/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteTyreProvider(@PathVariable Long id) {
        log.debug("REST request to delete TyreProvider : {}", id);
        tyreProviderRepository.deleteById(id);
        tyreProviderSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tyre-providers?query=:query : search for the tyreProvider corresponding
     * to the query.
     *
     * @param query the query of the tyreProvider search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/tyre-providers")
    public ResponseEntity<List<TyreProvider>> searchTyreProviders(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of TyreProviders for query {}", query);
        String searchValue = '*' + query + '*';
        Page<TyreProvider> page = tyreProviderSearchRepository.search(queryStringQuery(searchValue), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tyre-providers");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_typeahead/tyres")
    public List<TyreProvider> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of TyreProvider for query {}", query);
        String searchValue = '*' + query + '*';
        NativeSearchQueryBuilder nqb = new NativeSearchQueryBuilder()
        		.withQuery(QueryBuilders.boolQuery().must(queryStringQuery(searchValue)))
        		.withSort(SortBuilders.fieldSort("name"))
        		.withPageable(PageRequest.of(0, 5));
        Page<TyreProvider> page = tyreProviderSearchRepository.search(nqb.build());
        return page.getContent();
    }
}

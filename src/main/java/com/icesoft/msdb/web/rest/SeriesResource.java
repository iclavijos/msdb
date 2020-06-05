package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.SeriesRepository;
import com.icesoft.msdb.repository.search.SeriesSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.Series}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SeriesResource {

    private final Logger log = LoggerFactory.getLogger(SeriesResource.class);

    private static final String ENTITY_NAME = "series";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeriesRepository seriesRepository;

    private final SeriesSearchRepository seriesSearchRepository;
    private final SeriesEditionRepository seriesEditionRepository;

    private final CDNService cdnService;

    public SeriesResource(SeriesRepository seriesRepository, SeriesSearchRepository seriesSearchRepository,
    		SeriesEditionRepository seriesEditionRepository, CDNService cdnService) {
        this.seriesRepository = seriesRepository;
        this.seriesSearchRepository = seriesSearchRepository;
        this.seriesEditionRepository = seriesEditionRepository;
        this.cdnService = cdnService;
    }

    /**
     * {@code POST  /series} : Create a new series.
     *
     * @param series the series to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new series, or with status {@code 400 (Bad Request)} if the series has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/series")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> createSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to save Series : {}", series);
        if (series.getId() != null) {
            throw new BadRequestAlertException("A new series cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
        if (result.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getLogo(), ENTITY_NAME);
			result.setLogoUrl(cdnUrl);

			result = seriesRepository.save(result);
        }
        return ResponseEntity.created(new URI("/api/series/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /series} : Updates an existing series.
     *
     * @param series the series to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated series,
     * or with status {@code 400 (Bad Request)} if the series is not valid,
     * or with status {@code 500 (Internal Server Error)} if the series couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/series")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> updateSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to update Series : {}", series);
        if (series.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (series.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(series.getId().toString(), series.getLogo(), ENTITY_NAME);
        	series.logoUrl(cdnUrl);
        } else if (series.getLogoUrl() == null) {
        	cdnService.deleteImage(series.getId().toString(), ENTITY_NAME);
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, series.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /series} : get all the series.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of series in body.
     */
    @GetMapping("/series")
    @Timed
    public ResponseEntity<List<Series>> getAllSeries(Pageable pageable) {
        log.debug("REST request to get a page of Series");
        Page<Series> page = seriesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/series/{id}/editions")
    @Timed
    public ResponseEntity<List<SeriesEdition>> getAllEditions(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get a page of Series");
        Page<SeriesEdition> page = seriesEditionRepository.findBySeriesId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET  /series/:id} : get the "id" series.
     *
     * @param id the id of the series to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the series, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/series/{id}")
    @Timed
    public ResponseEntity<Series> getSeries(@PathVariable Long id) {
        log.debug("REST request to get Series : {}", id);
        Optional<Series> series = seriesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(series);
    }

    /**
     * {@code DELETE  /series/:id} : delete the "id" series.
     *
     * @param id the id of the series to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/series/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        log.debug("REST request to delete Series : {}", id);
        seriesRepository.deleteById(id);
        seriesSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/series?query=:query} : search for the series corresponding
     * to the query.
     *
     * @param query the query of the series search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/series")
    @Timed
    public ResponseEntity<List<Series>> searchSeries(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Series for query {}", query);
        String searchValue = "name:*" + query + '*';
        Page<Series> page = seriesSearchRepository.search(queryStringQuery(searchValue), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_search/{id}/editions")
    @Timed
    public ResponseEntity<List<SeriesEdition>> searchSeriesEditions(@PathVariable Long id, @RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SeriesEditions for query {}", query);
        //TODO: Implement proper search
        Page<SeriesEdition> page = seriesEditionRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

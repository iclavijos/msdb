package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.SeriesRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Series.
 */
@RestController
@RequestMapping("/api")
public class SeriesResource {

    private final Logger log = LoggerFactory.getLogger(SeriesResource.class);

    private static final String ENTITY_NAME = "series";
        
    private final SeriesRepository seriesRepository;
    private final SeriesEditionRepository seriesEditionRepository;
    
    private final CDNService cdnService;

    public SeriesResource(SeriesRepository seriesRepository, SeriesEditionRepository seriesEditionRepository, CDNService cdnService) {
        this.seriesRepository = seriesRepository;
        this.seriesEditionRepository = seriesEditionRepository;
        this.cdnService = cdnService;
    }

    /**
     * POST  /series : Create a new series.
     *
     * @param series the series to create
     * @return the ResponseEntity with status 201 (Created) and with body the new series, or with status 400 (Bad Request) if the series has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/series")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> createSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to save Series : {}", series);
        if (series.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new series cannot already have an ID")).body(null);
        }
        Series result = seriesRepository.save(series);
        
        if (result.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getLogo(), ENTITY_NAME);
			result.setLogoUrl(cdnUrl);
			
			result = seriesRepository.save(result);
        }
        return ResponseEntity.created(new URI("/api/series/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /series : Updates an existing series.
     *
     * @param series the series to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated series,
     * or with status 400 (Bad Request) if the series is not valid,
     * or with status 500 (Internal Server Error) if the series couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/series")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> updateSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to update Series : {}", series);
        if (series.getId() == null) {
            return createSeries(series);
        }
        if (series.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(series.getId().toString(), series.getLogo(), ENTITY_NAME);
        	series.logoUrl(cdnUrl);
        } else if (series.getLogoUrl() == null) {
        	cdnService.deleteImage(series.getId().toString(), ENTITY_NAME);
        }
        Series result = seriesRepository.save(series);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, series.getId().toString()))
            .body(result);
    }

    /**
     * GET  /series : get all the series.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of series in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/series")
    @Timed
    public ResponseEntity<List<Series>> getAllSeries(@ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Series");
        Page<Series> page = seriesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/series");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/series/{id}/editions")
    @Timed
    public ResponseEntity<List<SeriesEdition>> getAllEditions(@PathVariable Long id, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Series");
        Page<SeriesEdition> page = seriesEditionRepository.findBySeriesIdOrderByPeriodDesc(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/series/" + id + "/editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /series/:id : get the "id" series.
     *
     * @param id the id of the series to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the series, or with status 404 (Not Found)
     */
    @GetMapping("/series/{id}")
    @Timed
    public ResponseEntity<Series> getSeries(@PathVariable Long id) {
        log.debug("REST request to get Series : {}", id);
        Series series = seriesRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(series));
    }

    /**
     * DELETE  /series/:id : delete the "id" series.
     *
     * @param id the id of the series to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/series/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        log.debug("REST request to delete Series : {}", id);
        seriesRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/series?query=:query : search for the series corresponding
     * to the query.
     *
     * @param query the query of the series search 
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @GetMapping("/_search/series")
    @Timed
    public ResponseEntity<List<Series>> searchSeries(@RequestParam String query, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Series for query {}", query);
        Page<Series> page = seriesRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/series");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/_search/{id}/editions")
    @Timed
    public ResponseEntity<List<SeriesEdition>> searchSeriesEditions(@PathVariable Long id, @RequestParam String query, @ApiParam Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of SeriesEditions for query {}", query);
        //TODO: Implement proper search
        Page<SeriesEdition> page = seriesEditionRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/" + id + "/editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

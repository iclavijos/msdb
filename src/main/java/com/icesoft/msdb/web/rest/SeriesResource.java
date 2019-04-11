package com.icesoft.msdb.web.rest;
import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.repository.SeriesRepository;
import com.icesoft.msdb.repository.search.SeriesSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
 * REST controller for managing Series.
 */
@RestController
@RequestMapping("/api")
public class SeriesResource {

    private final Logger log = LoggerFactory.getLogger(SeriesResource.class);

    private static final String ENTITY_NAME = "series";

    private final SeriesRepository seriesRepository;

    private final SeriesSearchRepository seriesSearchRepository;

    public SeriesResource(SeriesRepository seriesRepository, SeriesSearchRepository seriesSearchRepository) {
        this.seriesRepository = seriesRepository;
        this.seriesSearchRepository = seriesSearchRepository;
    }

    /**
     * POST  /series : Create a new series.
     *
     * @param series the series to create
     * @return the ResponseEntity with status 201 (Created) and with body the new series, or with status 400 (Bad Request) if the series has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/series")
    public ResponseEntity<Series> createSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to save Series : {}", series);
        if (series.getId() != null) {
            throw new BadRequestAlertException("A new series cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
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
     * or with status 500 (Internal Server Error) if the series couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/series")
    public ResponseEntity<Series> updateSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to update Series : {}", series);
        if (series.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, series.getId().toString()))
            .body(result);
    }

    /**
     * GET  /series : get all the series.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of series in body
     */
    @GetMapping("/series")
    public ResponseEntity<List<Series>> getAllSeries(Pageable pageable) {
        log.debug("REST request to get a page of Series");
        Page<Series> page = seriesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/series");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /series/:id : get the "id" series.
     *
     * @param id the id of the series to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the series, or with status 404 (Not Found)
     */
    @GetMapping("/series/{id}")
    public ResponseEntity<Series> getSeries(@PathVariable Long id) {
        log.debug("REST request to get Series : {}", id);
        Optional<Series> series = seriesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(series);
    }

    /**
     * DELETE  /series/:id : delete the "id" series.
     *
     * @param id the id of the series to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/series/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        log.debug("REST request to delete Series : {}", id);
        seriesRepository.deleteById(id);
        seriesSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/series?query=:query : search for the series corresponding
     * to the query.
     *
     * @param query the query of the series search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/series")
    public ResponseEntity<List<Series>> searchSeries(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Series for query {}", query);
        Page<Series> page = seriesSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/series");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}

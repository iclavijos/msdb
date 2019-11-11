package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.search.SeriesEditionSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.SeriesEdition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SeriesEditionResource {

    private final Logger log = LoggerFactory.getLogger(SeriesEditionResource.class);

    private static final String ENTITY_NAME = "seriesEdition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeriesEditionRepository seriesEditionRepository;

    private final SeriesEditionSearchRepository seriesEditionSearchRepository;

    public SeriesEditionResource(SeriesEditionRepository seriesEditionRepository, SeriesEditionSearchRepository seriesEditionSearchRepository) {
        this.seriesEditionRepository = seriesEditionRepository;
        this.seriesEditionSearchRepository = seriesEditionSearchRepository;
    }

    /**
     * {@code POST  /series-editions} : Create a new seriesEdition.
     *
     * @param seriesEdition the seriesEdition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new seriesEdition, or with status {@code 400 (Bad Request)} if the seriesEdition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/series-editions")
    public ResponseEntity<SeriesEdition> createSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to save SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() != null) {
            throw new BadRequestAlertException("A new seriesEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SeriesEdition result = seriesEditionRepository.save(seriesEdition);
        seriesEditionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/series-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /series-editions} : Updates an existing seriesEdition.
     *
     * @param seriesEdition the seriesEdition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seriesEdition,
     * or with status {@code 400 (Bad Request)} if the seriesEdition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seriesEdition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/series-editions")
    public ResponseEntity<SeriesEdition> updateSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to update SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SeriesEdition result = seriesEditionRepository.save(seriesEdition);
        seriesEditionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, seriesEdition.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /series-editions} : get all the seriesEditions.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seriesEditions in body.
     */
    @GetMapping("/series-editions")
    public ResponseEntity<List<SeriesEdition>> getAllSeriesEditions(Pageable pageable) {
        log.debug("REST request to get a page of SeriesEditions");
        Page<SeriesEdition> page = seriesEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /series-editions/:id} : get the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the seriesEdition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/series-editions/{id}")
    public ResponseEntity<SeriesEdition> getSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to get SeriesEdition : {}", id);
        Optional<SeriesEdition> seriesEdition = seriesEditionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seriesEdition);
    }

    /**
     * {@code DELETE  /series-editions/:id} : delete the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/series-editions/{id}")
    public ResponseEntity<Void> deleteSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to delete SeriesEdition : {}", id);
        seriesEditionRepository.deleteById(id);
        seriesEditionSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/series-editions?query=:query} : search for the seriesEdition corresponding
     * to the query.
     *
     * @param query the query of the seriesEdition search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/series-editions")
    public ResponseEntity<List<SeriesEdition>> searchSeriesEditions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SeriesEditions for query {}", query);
        Page<SeriesEdition> page = seriesEditionSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

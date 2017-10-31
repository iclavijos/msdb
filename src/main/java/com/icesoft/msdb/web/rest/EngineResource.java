package com.icesoft.msdb.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.domain.Engine;

import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.repository.search.EngineSearchRepository;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
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
 * REST controller for managing Engine.
 */
@RestController
@RequestMapping("/api")
public class EngineResource {

    private final Logger log = LoggerFactory.getLogger(EngineResource.class);

    private static final String ENTITY_NAME = "engine";

    private final EngineRepository engineRepository;

    private final EngineSearchRepository engineSearchRepository;

    public EngineResource(EngineRepository engineRepository, EngineSearchRepository engineSearchRepository) {
        this.engineRepository = engineRepository;
        this.engineSearchRepository = engineSearchRepository;
    }

    /**
     * POST  /engines : Create a new engine.
     *
     * @param engine the engine to create
     * @return the ResponseEntity with status 201 (Created) and with body the new engine, or with status 400 (Bad Request) if the engine has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/engines")
    @Timed
    public ResponseEntity<Engine> createEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to save Engine : {}", engine);
        if (engine.getId() != null) {
            throw new BadRequestAlertException("A new engine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/engines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /engines : Updates an existing engine.
     *
     * @param engine the engine to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated engine,
     * or with status 400 (Bad Request) if the engine is not valid,
     * or with status 500 (Internal Server Error) if the engine couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/engines")
    @Timed
    public ResponseEntity<Engine> updateEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to update Engine : {}", engine);
        if (engine.getId() == null) {
            return createEngine(engine);
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, engine.getId().toString()))
            .body(result);
    }

    /**
     * GET  /engines : get all the engines.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of engines in body
     */
    @GetMapping("/engines")
    @Timed
    public ResponseEntity<List<Engine>> getAllEngines(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Engines");
        Page<Engine> page = engineRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/engines");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /engines/:id : get the "id" engine.
     *
     * @param id the id of the engine to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the engine, or with status 404 (Not Found)
     */
    @GetMapping("/engines/{id}")
    @Timed
    public ResponseEntity<Engine> getEngine(@PathVariable Long id) {
        log.debug("REST request to get Engine : {}", id);
        Engine engine = engineRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(engine));
    }

    /**
     * DELETE  /engines/:id : delete the "id" engine.
     *
     * @param id the id of the engine to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/engines/{id}")
    @Timed
    public ResponseEntity<Void> deleteEngine(@PathVariable Long id) {
        log.debug("REST request to delete Engine : {}", id);
        engineRepository.delete(id);
        engineSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/engines?query=:query : search for the engine corresponding
     * to the query.
     *
     * @param query the query of the engine search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/engines")
    @Timed
    public ResponseEntity<List<Engine>> searchEngines(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = engineSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/engines");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

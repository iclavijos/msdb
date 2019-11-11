package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.repository.search.EngineSearchRepository;
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
 * REST controller for managing {@link com.icesoft.msdb.domain.Engine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EngineResource {

    private final Logger log = LoggerFactory.getLogger(EngineResource.class);

    private static final String ENTITY_NAME = "engine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EngineRepository engineRepository;

    private final EngineSearchRepository engineSearchRepository;

    public EngineResource(EngineRepository engineRepository, EngineSearchRepository engineSearchRepository) {
        this.engineRepository = engineRepository;
        this.engineSearchRepository = engineSearchRepository;
    }

    /**
     * {@code POST  /engines} : Create a new engine.
     *
     * @param engine the engine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new engine, or with status {@code 400 (Bad Request)} if the engine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/engines")
    public ResponseEntity<Engine> createEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to save Engine : {}", engine);
        if (engine.getId() != null) {
            throw new BadRequestAlertException("A new engine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/engines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /engines} : Updates an existing engine.
     *
     * @param engine the engine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated engine,
     * or with status {@code 400 (Bad Request)} if the engine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the engine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/engines")
    public ResponseEntity<Engine> updateEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to update Engine : {}", engine);
        if (engine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, engine.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /engines} : get all the engines.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of engines in body.
     */
    @GetMapping("/engines")
    public ResponseEntity<List<Engine>> getAllEngines(Pageable pageable) {
        log.debug("REST request to get a page of Engines");
        Page<Engine> page = engineRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /engines/:id} : get the "id" engine.
     *
     * @param id the id of the engine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the engine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/engines/{id}")
    public ResponseEntity<Engine> getEngine(@PathVariable Long id) {
        log.debug("REST request to get Engine : {}", id);
        Optional<Engine> engine = engineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(engine);
    }

    /**
     * {@code DELETE  /engines/:id} : delete the "id" engine.
     *
     * @param id the id of the engine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/engines/{id}")
    public ResponseEntity<Void> deleteEngine(@PathVariable Long id) {
        log.debug("REST request to delete Engine : {}", id);
        engineRepository.deleteById(id);
        engineSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/engines?query=:query} : search for the engine corresponding
     * to the query.
     *
     * @param query the query of the engine search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/engines")
    public ResponseEntity<List<Engine>> searchEngines(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = engineSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

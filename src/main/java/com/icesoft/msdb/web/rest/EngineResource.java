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
import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Engine.
 */
@RestController
@RequestMapping("/api")
public class EngineResource {

    private final Logger log = LoggerFactory.getLogger(EngineResource.class);

    private static final String ENTITY_NAME = "engine";
        
    private final EngineRepository engineRepository;

    private final CDNService cdnService;

    public EngineResource(EngineRepository engineRepository, CDNService cdnService) {
        this.engineRepository = engineRepository;
        this.cdnService = cdnService;
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
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Engine> createEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to save Engine : {}", engine);
        if (engine.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new engine cannot already have an ID")).body(null);
        }
        Engine result = engineRepository.save(engine);
        
        if (engine.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), engine.getImage(), "engines");
			result.setImageUrl(cdnUrl);
			
			result = engineRepository.save(result);
        }
        
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
     * or with status 500 (Internal Server Error) if the engine couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/engines")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Engine> updateEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to update Engine : {}", engine);
        if (engine.getId() == null) {
            return createEngine(engine);
        }
        
        if (engine.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(engine.getId().toString(), engine.getImage(), "engines");
			engine.setImageUrl(cdnUrl);
        } else {
        	cdnService.deleteImage(engine.getId().toString(), "engines");
        }
        Engine result = engineRepository.save(engine);
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, engine.getId().toString()))
            .body(result);
    }

    /**
     * GET  /engines : get all the engines.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of engines in body
     */
    @GetMapping("/engines")
    @Timed
    public ResponseEntity<List<Engine>> getAllEngines(@ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get all Engines");
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
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEngine(@PathVariable Long id) {
        log.debug("REST request to delete Engine : {}", id);
        engineRepository.delete(id);
        cdnService.deleteImage(id.toString(), "engines");
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/engines?query=:query : search for the engine corresponding
     * to the query.
     *
     * @param query the query of the engine search 
     * @return the result of the search
     */
    @GetMapping("/_search/engines")
    @Timed
    public ResponseEntity<List<Engine>> searchEngines(@RequestParam String query, @ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = engineRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/engines");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}

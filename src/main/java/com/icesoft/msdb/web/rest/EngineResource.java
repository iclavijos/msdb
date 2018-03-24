package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.EngineSearchRepository;
import com.icesoft.msdb.repository.stats.EngineStatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
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
    private final EngineSearchRepository engineSearchRepository;
    private final EventEntryRepository entryRepository;
    
    private final EngineStatisticsRepository statsRepo;

    private final CDNService cdnService;

    public EngineResource(EngineRepository engineRepository, EngineSearchRepository engineSearchRepository, EventEntryRepository entryRepository, 
    		EngineStatisticsRepository statsRepo, CDNService cdnService) {
        this.engineRepository = engineRepository;
        this.engineSearchRepository = engineSearchRepository;
        this.entryRepository = entryRepository;
        this.statsRepo = statsRepo;
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
            throw new BadRequestAlertException("A new engine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        
        if (engine.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), engine.getImage(), ENTITY_NAME);
			result.setImageUrl(cdnUrl);
			
			result = engineRepository.save(result);
			engineSearchRepository.save(result);
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
	        String cdnUrl = cdnService.uploadImage(engine.getId().toString(), engine.getImage(), ENTITY_NAME);
			engine.setImageUrl(cdnUrl);
        } else if (engine.getImageUrl() == null) {
        	cdnService.deleteImage(engine.getId().toString(), ENTITY_NAME);
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
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEngine(@PathVariable Long id) {
        log.debug("REST request to delete Engine : {}", id);
        engineRepository.delete(id);
        engineSearchRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping("/engines/{id}/statistics")
    @Timed
    public ResponseEntity<ParticipantStatisticsSnapshot> getDriverStatistics(@PathVariable Long id) {
    	log.debug("REST request to get statistics for engine : {}", id);
    	ParticipantStatisticsSnapshot stats = statsRepo.findOne(id.toString());
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(stats));
    }
    
    @GetMapping("/engines/{id}/participations/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for engine {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findOne(id.toString());
    	List<Long> ids = stats.getStaticsForCategory(category).getParticipationsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	int start = pageable.getOffset();
    	int end = start + pageable.getPageSize();
    	if (end > ids.size()) {
    		end = ids.size();
    	}
    	
    	List<EventEntrySearchResultDTO> result = entryRepository.findEntriesInList(ids.subList(start, end)).parallelStream().map(entry -> {
    		return stats.getStaticsForCategory(category).getResultByEntryId(entry.getId()).parallelStream().map(res -> {
    			return new EventEntrySearchResultDTO(entry, res.getEventDate(), res.getPoleLapTime(), res.getRaceFastLapTime(), 
    					res.getGridPosition(), res.getPosition(), res.getRetirementCause());
    		}).collect(Collectors.toList());
    	}).flatMap(l->l.stream()).collect(Collectors.toList());
    	
    	Page<EventEntrySearchResultDTO> page = new PageImpl<>(result, pageable, stats.getStaticsForCategory(category).getParticipationsList().size());
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/engines/%s/participations/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/engines/{id}/wins/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for engine {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findOne(id.toString());
    	List<Long> ids = stats.getStaticsForCategory(category).getWinsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	int start = pageable.getOffset();
    	int end = start + pageable.getPageSize();
    	if (end > ids.size()) {
    		end = ids.size();
    	}
    	
    	List<EventEntrySearchResultDTO> result = entryRepository.findEntriesInList(ids.subList(start, end)).parallelStream().map(entry -> {
    		return stats.getStaticsForCategory(category).getResultByEntryId(entry.getId()).parallelStream().map(res -> {
    			return new EventEntrySearchResultDTO(entry, res.getEventDate(), res.getPoleLapTime(), res.getRaceFastLapTime(), 
    					res.getGridPosition(), res.getPosition(), res.getRetirementCause());
    		}).collect(Collectors.toList());
    	}).flatMap(l->l.stream()).collect(Collectors.toList());
    	Page<EventEntrySearchResultDTO> page = new PageImpl<>(result, pageable, stats.getStaticsForCategory(category).getWinsList().size());
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/engines/%s/wins/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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
        Page<Engine> page = performSearch(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/engines");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/_typeahead/engines")
    @Timed
    public List<Engine> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = performSearch(query, new PageRequest(0, 5));
        return page.getContent();
    }
    
    private Page<Engine> performSearch(String query, Pageable pageable) {
    	QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
    			QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
    				.analyzeWildcard(true)
    				.field("name", 2.0f)
    				.field("manufacturer", 1.5f)
    				.field("architecture"));
    	
    	return engineSearchRepository.search(queryBuilder, pageable);
    }
}

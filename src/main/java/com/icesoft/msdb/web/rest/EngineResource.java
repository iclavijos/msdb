package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.domain.stats.EngineStatistics;
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
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
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
     * or with status 500 (Internal Server Error) if the engine couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/engines")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Engine> updateEngine(@Valid @RequestBody Engine engine) throws URISyntaxException {
        log.debug("REST request to update Engine : {}", engine);
        if (engine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
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
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of engines in body
     */
    @GetMapping("/engines")
    public ResponseEntity<List<Engine>> getAllEngines(Pageable pageable) {
        log.debug("REST request to get a page of Engines");
        Page<Engine> page = engineRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/engines");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /engines/:id : get the "id" engine.
     *
     * @param id the id of the engine to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the engine, or with status 404 (Not Found)
     */
    @GetMapping("/engines/{id}")
    public ResponseEntity<Engine> getEngine(@PathVariable Long id) {
        log.debug("REST request to get Engine : {}", id);
        Optional<Engine> engine = engineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(engine);
    }

    /**
     * DELETE  /engines/:id : delete the "id" engine.
     *
     * @param id the id of the engine to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/engines/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteEngine(@PathVariable Long id) {
        log.debug("REST request to delete Engine : {}", id);
        engineRepository.deleteById(id);
        engineSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/engines/{id}/statistics")
    public ResponseEntity<EngineStatistics> getEngineStatistics(@PathVariable Long id) {
    	log.debug("REST request to get statistics for engine : {}", id);
    	Optional<EngineStatistics> stats = statsRepo.findById(id.toString());
        return ResponseUtil.wrapOrNotFound(stats);
    }

    @GetMapping("/engines/{id}/participations/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for engine {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new EngineStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getParticipationsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	int start = (int) pageable.getOffset();
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
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for engine {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new EngineStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getWinsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	int start = (int) pageable.getOffset();
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
    public ResponseEntity<List<Engine>> searchEngines(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = performSearch(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/engines");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_typeahead/engines")
    public List<Engine> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of Engines for query {}", query);
        Page<Engine> page = performSearch(query, PageRequest.of(0, 5));
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

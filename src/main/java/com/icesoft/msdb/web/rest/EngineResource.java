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
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.EngineEvolutionDTO;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.service.dto.ItemEvolutionDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import org.apache.commons.lang3.StringUtils;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private final EventEntryRepository entryRepository;
    private final SearchService searchService;

    private final EngineStatisticsRepository statsRepo;

    private final CDNService cdnService;

    public EngineResource(EngineRepository engineRepository, EngineSearchRepository engineSearchRepository, EventEntryRepository entryRepository,
    		EngineStatisticsRepository statsRepo, CDNService cdnService, SearchService searchService) {
        this.engineRepository = engineRepository;
        this.engineSearchRepository = engineSearchRepository;
        this.entryRepository = entryRepository;
        this.statsRepo = statsRepo;
        this.cdnService = cdnService;
        this.searchService = searchService;
    }

    /**
     * {@code POST  /engines} : Create a new engine.
     *
     * @param engine the engine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new engine, or with status {@code 400 (Bad Request)} if the engine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
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

        return ResponseEntity
            .created(new URI("/api/engines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /engines/:id} : Updates an existing engine.
     *
     * @param id the id of the engine to save.
     * @param engine the engine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated engine,
     * or with status {@code 400 (Bad Request)} if the engine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the engine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/engines/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Engine> updateEngine(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Engine engine
    ) throws URISyntaxException {
        log.debug("REST request to update Engine : {}, {}", id, engine);
        if (engine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, engine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!engineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (engine.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(engine.getId().toString(), engine.getImage(), ENTITY_NAME);
			engine.setImageUrl(cdnUrl);
        } else if (engine.getImageUrl() == null) {
        	cdnService.deleteImage(engine.getId().toString(), ENTITY_NAME);
        }
        Engine result = engineRepository.save(engine);
        engineSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, engine.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /engines/:id} : Partial updates given fields of an existing engine, field will ignore if it is null
     *
     * @param id the id of the engine to save.
     * @param engine the engine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated engine,
     * or with status {@code 400 (Bad Request)} if the engine is not valid,
     * or with status {@code 404 (Not Found)} if the engine is not found,
     * or with status {@code 500 (Internal Server Error)} if the engine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/engines/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Engine> partialUpdateEngine(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Engine engine
    ) throws URISyntaxException {
        log.debug("REST request to partial update Engine partially : {}, {}", id, engine);
        if (engine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, engine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!engineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Engine> result = engineRepository
            .findById(engine.getId())
            .map(existingEngine -> {
                if (engine.getName() != null) {
                    existingEngine.setName(engine.getName());
                }
                if (engine.getManufacturer() != null) {
                    existingEngine.setManufacturer(engine.getManufacturer());
                }
                if (engine.getCapacity() != null) {
                    existingEngine.setCapacity(engine.getCapacity());
                }
                if (engine.getArchitecture() != null) {
                    existingEngine.setArchitecture(engine.getArchitecture());
                }
                if (engine.getDebutYear() != null) {
                    existingEngine.setDebutYear(engine.getDebutYear());
                }
                if (engine.getPetrolEngine() != null) {
                    existingEngine.setPetrolEngine(engine.getPetrolEngine());
                }
                if (engine.getDieselEngine() != null) {
                    existingEngine.setDieselEngine(engine.getDieselEngine());
                }
                if (engine.getElectricEngine() != null) {
                    existingEngine.setElectricEngine(engine.getElectricEngine());
                }
                if (engine.getOtherEngine() != null) {
                    existingEngine.setOtherEngine(engine.getOtherEngine());
                }
                if (engine.getTurbo() != null) {
                    existingEngine.setTurbo(engine.getTurbo());
                }
                if (engine.getImage() != null) {
                    existingEngine.setImage(engine.getImage());
                }

                return existingEngine;
            })
            .map(engineRepository::save)
            .map(savedEngine -> {
                engineSearchRepository.save(savedEngine);

                return savedEngine;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, engine.getId().toString())
        );
    }

    /**
     * {@code GET  /engines} : get all the engines.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of engines in body.
     */
    @GetMapping("/engines")
    public ResponseEntity<List<Engine>> getEngines(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to get a page of Engines");
        Page<Engine> page;
        if (!StringUtils.isBlank(query)) {
            page = searchService.performWildcardSearch(
                Engine.class,
                query.toLowerCase(),
                Arrays.asList("manufacturer", "name"),
                pageable);
        } else {
            page = engineRepository.findAll(pageable);
        }
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
     *
     */
    @GetMapping("/engines/{id}/statistics")
    public ResponseEntity<EngineStatistics> getEngineStatistics(@PathVariable Long id) {
    	log.debug("REST request to get statistics for engine : {}", id);
    	Optional<EngineStatistics> stats = statsRepo.findById(id.toString());
        return ResponseUtil.wrapOrNotFound(stats);
    }

    @GetMapping("/engines/{id}/evolutions")
    public ResponseEntity<List<ItemEvolutionDTO>> getEngineEvolutions(@PathVariable Long id) {
        log.debug("REST request to get engine evolutions : {}", id);
        Optional<Engine> engine = engineRepository.findById(id);
        EngineEvolutionDTO parentResult = new EngineEvolutionDTO(engine.orElse(new Engine()));
        return ResponseEntity.ok(parentResult.getEvolutions());
    }

    @GetMapping("/engines/{id}/participations/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for engine {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new EngineStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getParticipationsList().parallelStream()
            .sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	long start = pageable.getOffset();
    	long end = start + pageable.getPageSize();
    	if (end > ids.size()) {
    		end = ids.size();
    	}

    	List<EventEntrySearchResultDTO> result = entryRepository.findEntriesInList(ids.subList((int)start, (int)end)).parallelStream().map(entry -> {
    		return stats.getStaticsForCategory(category).getResultByEntryId(entry.getId()).parallelStream().map(res -> {
    			return new EventEntrySearchResultDTO(entry, res.getEventDate(), res.getPoleLapTime(), res.getRaceFastLapTime(),
    					res.getGridPosition(), res.getPosition(), res.getRetirementCause());
    		}).collect(Collectors.toList());
    	}).flatMap(l->l.stream()).collect(Collectors.toList());

    	Page<EventEntrySearchResultDTO> page = new PageImpl<>(result, pageable, stats.getStaticsForCategory(category).getParticipationsList().size());
    	HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/engines/{id}/wins/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getEngineWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for engine {} in category {}", id, category);
    	EngineStatistics stats = statsRepo.findById(id.toString()).orElse(new EngineStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getWinsList().parallelStream()
            .sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
    		.map(p -> p.getEntryId()).collect(Collectors.toList());
    	long start = pageable.getOffset();
    	long end = start + pageable.getPageSize();
    	if (end > ids.size()) {
    		end = ids.size();
    	}

    	List<EventEntrySearchResultDTO> result = entryRepository.findEntriesInList(ids.subList((int)start, (int)end)).parallelStream().map(entry -> {
    		return stats.getStaticsForCategory(category).getResultByEntryId(entry.getId()).parallelStream().map(res -> {
    			return new EventEntrySearchResultDTO(entry, res.getEventDate(), res.getPoleLapTime(), res.getRaceFastLapTime(),
    					res.getGridPosition(), res.getPosition(), res.getRetirementCause());
    		}).collect(Collectors.toList());
    	}).flatMap(l->l.stream()).collect(Collectors.toList());
    	Page<EventEntrySearchResultDTO> page = new PageImpl<>(result, pageable, stats.getStaticsForCategory(category).getWinsList().size());
    	HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

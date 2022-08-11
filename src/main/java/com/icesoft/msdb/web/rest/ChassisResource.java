package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Chassis;
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.repository.jpa.ChassisRepository;
import com.icesoft.msdb.repository.jpa.EventEntryRepository;
import com.icesoft.msdb.repository.search.ChassisSearchRepository;
import com.icesoft.msdb.repository.mongo.stats.ChassisStatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.ChassisEvolutionDTO;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.service.dto.ItemEvolutionDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.Chassis}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChassisResource {

    private final Logger log = LoggerFactory.getLogger(ChassisResource.class);

    private static final String ENTITY_NAME = "chassis";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChassisRepository chassisRepository;
    private final EventEntryRepository entryRepository;

    private final ChassisStatisticsRepository statsRepo;

    private final ChassisSearchRepository chassisSearchRepository;
    private final SearchService searchService;

    private final CDNService cdnService;

    public ChassisResource(ChassisRepository chassisRepository, ChassisSearchRepository chassisSearchRepository, EventEntryRepository entryRepository,
    		ChassisStatisticsRepository chassisStatsRepo, CDNService cdnService, SearchService searchService) {
        this.chassisRepository = chassisRepository;
        this.chassisSearchRepository = chassisSearchRepository;
        this.entryRepository = entryRepository;
        this.statsRepo = chassisStatsRepo;
        this.cdnService = cdnService;
        this.searchService = searchService;
    }

    /**
     * {@code POST  /chassis} : Create a new chassis.
     *
     * @param chassis the chassis to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chassis, or with status {@code 400 (Bad Request)} if the chassis has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chassis")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Chassis> createChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to save Chassis : {}", chassis);
        if (chassis.getId() != null) {
            throw new BadRequestAlertException("A new chassis cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chassis result = chassisRepository.save(chassis);
        chassisSearchRepository.save(result);

        if (chassis.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), chassis.getImage(), ENTITY_NAME);
			result.setImageUrl(cdnUrl);

			result = chassisRepository.save(result);
        }

        return ResponseEntity
            .created(new URI("/api/chassis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chassis/:id} : Updates an existing chassis.
     *
     * @param id the id of the chassis to save.
     * @param chassis the chassis to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chassis,
     * or with status {@code 400 (Bad Request)} if the chassis is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chassis couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chassis/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Chassis> updateChassis(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Chassis chassis
    ) throws URISyntaxException {
        log.debug("REST request to update Chassis : {}, {}", id, chassis);
        if (chassis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chassis.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chassisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (chassis.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(chassis.getId().toString(), chassis.getImage(), ENTITY_NAME);
	        chassis.setImageUrl(cdnUrl);
        } else if (chassis.getImageUrl() == null) {
        	cdnService.deleteImage(chassis.getId().toString(), ENTITY_NAME);
        }

        Chassis result = chassisRepository.save(chassis);
        chassisSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chassis.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chassis/:id} : Partial updates given fields of an existing chassis, field will ignore if it is null
     *
     * @param id the id of the chassis to save.
     * @param chassis the chassis to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chassis,
     * or with status {@code 400 (Bad Request)} if the chassis is not valid,
     * or with status {@code 404 (Not Found)} if the chassis is not found,
     * or with status {@code 500 (Internal Server Error)} if the chassis couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chassis/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chassis> partialUpdateChassis(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Chassis chassis
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chassis partially : {}, {}", id, chassis);
        if (chassis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chassis.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chassisRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chassis> result = chassisRepository
            .findById(chassis.getId())
            .map(existingChassis -> {
                if (chassis.getName() != null) {
                    existingChassis.setName(chassis.getName());
                }
                if (chassis.getManufacturer() != null) {
                    existingChassis.setManufacturer(chassis.getManufacturer());
                }
                if (chassis.getDebutYear() != null) {
                    existingChassis.setDebutYear(chassis.getDebutYear());
                }

                return existingChassis;
            })
            .map(chassisRepository::save)
            .map(savedChassis -> {
                chassisSearchRepository.save(savedChassis);

                return savedChassis;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chassis.getId().toString())
        );
    }

    /**
     * {@code GET  /chassis} : get all the chassis.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chassis in body.
     */
    @GetMapping("/chassis")
    public ResponseEntity<List<Chassis>> getChassis(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to get a page of Chassis");
        Page<Chassis> page;
        Optional<String> queryOpt = Optional.ofNullable(query);
        if (queryOpt.isPresent()) {
            page = searchService.performWildcardSearch(
                Chassis.class,
                query.toLowerCase(),
                Arrays.asList("manufacturer", "name"),
                pageable);
        } else {
            page = chassisRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chassis/:id} : get the "id" chassis.
     *
     * @param id the id of the chassis to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chassis, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chassis/{id}")
    public ResponseEntity<Chassis> getChassis(@PathVariable Long id) {
        log.debug("REST request to get Chassis : {}", id);
        Optional<Chassis> chassis = chassisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chassis);
    }

    /**
     * {@code DELETE  /chassis/:id} : delete the "id" chassis.
     *
     * @param id the id of the chassis to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chassis/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteChassis(@PathVariable Long id) {
        log.debug("REST request to delete Chassis : {}", id);
        chassisRepository.deleteById(id);
        chassisSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/chassis/{id}/evolutions")

    public ResponseEntity<List<ItemEvolutionDTO>> getChassisEvolutions(@PathVariable Long id) {
        log.debug("REST request to get Chassis evolutions : {}", id);
        Optional<Chassis> chassis = chassisRepository.findById(id);
        ChassisEvolutionDTO parentResult = new ChassisEvolutionDTO(chassis.orElse(new Chassis()));
        return ResponseEntity.ok(parentResult.getEvolutions());
    }

    @GetMapping("/chassis/{chassisId}/statistics")
	public ResponseEntity<ChassisStatistics> getChassisStatistics(@PathVariable Long chassisId) {
    	log.debug("REST request to get statistics for chassis : {}", chassisId);
    	Optional<ChassisStatistics> stats = statsRepo.findById(chassisId.toString());
        return ResponseUtil.wrapOrNotFound(stats);
	}

    @GetMapping("/chassis/{id}/participations/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getChassisParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for chassis {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).get();
    	List<Long> ids = stats.getStaticsForCategory(category).getParticipationsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
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

    @GetMapping("/chassis/{id}/wins/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getChassisWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for chassis {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new ChassisStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getWinsList()
            .parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
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

    @GetMapping("/_typeahead/chassis")
    public List<Chassis> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = searchService.performWildcardSearch(
            Chassis.class,
            query.toLowerCase(),
            Arrays.asList("manufacturer", "name"),
            PageRequest.of(0, 10));
        return page.getContent();
    }

}

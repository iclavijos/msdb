package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Chassis;
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.repository.ChassisRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.ChassisSearchRepository;
import com.icesoft.msdb.repository.stats.ChassisStatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
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

/**
 * REST controller for managing Chassis.
 */
@RestController
@RequestMapping("/api")
public class ChassisResource {

    private final Logger log = LoggerFactory.getLogger(ChassisResource.class);

    private static final String ENTITY_NAME = "chassis";

    private final ChassisRepository chassisRepository;
    private final EventEntryRepository entryRepository;

    private final ChassisStatisticsRepository statsRepo;

    private final ChassisSearchRepository chassisSearchRepository;

    private final CDNService cdnService;

    public ChassisResource(ChassisRepository chassisRepository, ChassisSearchRepository chassisSearchRepository, EventEntryRepository entryRepository,
    		ChassisStatisticsRepository chassisStatsRepo, CDNService cdnService) {
        this.chassisRepository = chassisRepository;
        this.chassisSearchRepository = chassisSearchRepository;
        this.entryRepository = entryRepository;
        this.statsRepo = chassisStatsRepo;
        this.cdnService = cdnService;
    }

    /**
     * POST  /chassis : Create a new chassis.
     *
     * @param chassis the chassis to create
     * @return the ResponseEntity with status 201 (Created) and with body the new chassis, or with status 400 (Bad Request) if the chassis has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
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

        return ResponseEntity.created(new URI("/api/chassis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /chassis : Updates an existing chassis.
     *
     * @param chassis the chassis to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated chassis,
     * or with status 400 (Bad Request) if the chassis is not valid,
     * or with status 500 (Internal Server Error) if the chassis couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/chassis")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Chassis> updateChassis(@Valid @RequestBody Chassis chassis) throws URISyntaxException {
        log.debug("REST request to update Chassis : {}", chassis);
        if (chassis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (chassis.getImage() != null) {
	        String cdnUrl = cdnService.uploadImage(chassis.getId().toString(), chassis.getImage(), ENTITY_NAME);
	        chassis.setImageUrl(cdnUrl);
        } else if (chassis.getImageUrl() == null) {
        	cdnService.deleteImage(chassis.getId().toString(), ENTITY_NAME);
        }

        Chassis result = chassisRepository.save(chassis);
        chassisSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, chassis.getId().toString()))
            .body(result);
    }

    /**
     * GET  /chassis : get all the chassis.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of chassis in body
     */
    @GetMapping("/chassis")
    public ResponseEntity<List<Chassis>> getAllChassis(Pageable pageable) {
        log.debug("REST request to get a page of Chassis");
        Page<Chassis> page = chassisRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/chassis");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /chassis/:id : get the "id" chassis.
     *
     * @param id the id of the chassis to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chassis, or with status 404 (Not Found)
     */
    @GetMapping("/chassis/{id}")
    public ResponseEntity<Chassis> getChassis(@PathVariable Long id) {
        log.debug("REST request to get Chassis : {}", id);
        Optional<Chassis> chassis = chassisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chassis);
    }

    /**
     * DELETE  /chassis/:id : delete the "id" chassis.
     *
     * @param id the id of the chassis to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/chassis/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteChassis(@PathVariable Long id) {
        log.debug("REST request to delete Chassis : {}", id);
        chassisRepository.deleteById(id);
        chassisSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
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
        ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new ChassisStatistics(id.toString()));

        Page<EventEntrySearchResultDTO> page = statisticsPerCategory(category, pageable, stats, entryRepository);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/chassis/%s/participations/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/chassis/{id}/wins/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getChassisWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for chassis {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new ChassisStatistics(id.toString()));
        Page<EventEntrySearchResultDTO> page = statisticsPerCategory(category, pageable, stats, entryRepository);
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/chassis/%s/wins/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private Page<EventEntrySearchResultDTO> statisticsPerCategory(@PathVariable String category, Pageable pageable, ParticipantStatisticsSnapshot stats, EventEntryRepository entryRepository) {
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

        return new PageImpl<>(result, pageable, stats.getStaticsForCategory(category).getParticipationsList().size());
    }

    /**
     * SEARCH  /_search/chassis?query=:query : search for the chassis corresponding
     * to the query.
     *
     * @param query the query of the chassis search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/chassis")
    public ResponseEntity<List<Chassis>> searchChassis(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = performSearch(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/chassis");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_typeahead/chassis")
    public List<Chassis> typeahead(@RequestParam String query) {
        log.debug("REST request to search for a page of Chassis for query {}", query);
        Page<Chassis> page = performSearch(query, PageRequest.of(0, 5));
        return page.getContent();
    }

    private Page<Chassis> performSearch(String query, Pageable pageable) {
    	QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
    			QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
    				.analyzeWildcard(true)
    				.field("name", 2.0f)
    				.field("manufacturer"));

    	return chassisSearchRepository.search(queryBuilder, pageable);
    }
}

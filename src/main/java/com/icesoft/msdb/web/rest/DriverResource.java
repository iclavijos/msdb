package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.search.DriverSearchRepository;
import com.icesoft.msdb.repository.stats.DriverStatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.DriverFullNameDTO;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
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
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.Driver}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DriverResource {

    private final Logger log = LoggerFactory.getLogger(DriverResource.class);

    private static final String ENTITY_NAME = "driver";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DriverRepository driverRepository;

    private final DriverSearchRepository driverSearchRepository;
    private final EventEntryRepository entryRepository;

    private final SearchService searchService;

    private final DriverStatisticsRepository statsRepo;

    private final CDNService cdnService;

    public DriverResource(DriverRepository driverRepository, DriverSearchRepository driverSearchRepository, EventEntryRepository entryRepository,
                          SearchService searchService, DriverStatisticsRepository statsRepo, CDNService cdnService) {
        this.driverRepository = driverRepository;
        this.driverSearchRepository = driverSearchRepository;
        this.entryRepository = entryRepository;
        this.searchService = searchService;
        this.statsRepo = statsRepo;
        this.cdnService = cdnService;
    }

    /**
     * {@code POST  /drivers} : Create a new driver.
     *
     * @param driver the driver to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new driver, or with status {@code 400 (Bad Request)} if the driver has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/drivers")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Driver> createDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to save Driver : {}", driver);
        if (driver.getId() != null) {
            throw new BadRequestAlertException("A new driver cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Driver result = driverRepository.save(driver);
        driverSearchRepository.save(result);
        if (driver.getPortrait() != null) {
	        String cdnUrl = cdnService.uploadImage(driver.getId().toString(), driver.getPortrait(), ENTITY_NAME);
			driver.portraitUrl(cdnUrl);

			result = driverRepository.save(driver);
			driverSearchRepository.save(result);
        }

        return ResponseEntity.created(new URI("/api/drivers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /drivers} : Updates an existing driver.
     *
     * @param driver the driver to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated driver,
     * or with status {@code 400 (Bad Request)} if the driver is not valid,
     * or with status {@code 500 (Internal Server Error)} if the driver couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/drivers")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Driver> updateDriver(@Valid @RequestBody Driver driver) throws URISyntaxException {
        log.debug("REST request to update Driver : {}", driver);
        if (driver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (driver.getPortrait() != null) {
	        String cdnUrl = cdnService.uploadImage(driver.getId().toString(), driver.getPortrait(), ENTITY_NAME);
	        driver.setPortraitUrl(cdnUrl);
        } else if (driver.getPortraitUrl() == null) {
        	cdnService.deleteImage(driver.getId().toString(), ENTITY_NAME);
        }
        Driver result = driverRepository.save(driver);
        driverSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, driver.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /drivers} : get all the drivers.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of drivers in body.
     */
    @GetMapping("/drivers")
    @Timed
    public ResponseEntity<List<Driver>> getAllDrivers(Pageable pageable) {
        log.debug("REST request to get a page of Drivers");
        Page<Driver> page = driverRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /drivers/:id} : get the "id" driver.
     *
     * @param id the id of the driver to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the driver, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/drivers/{id}")
    @Timed
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        log.debug("REST request to get Driver : {}", id);
        Optional<Driver> driver = driverRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(driver);
    }

    /**
     *
     */
    @GetMapping("/drivers/{id}/statistics")
    @Timed
    public ResponseEntity<DriverStatistics> getDriverStatistics(@PathVariable Long id) {
    	log.debug("REST request to get statistics for driver : {}", id);
    	Optional<DriverStatistics> stats = statsRepo.findById(id.toString());
        return ResponseUtil.wrapOrNotFound(stats);
    }

    @GetMapping("/drivers/{id}/participations/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getDriverParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for driver {} in category {}", id, category);
        DriverStatistics stats = statsRepo.findById(id.toString()).orElse(new DriverStatistics(id.toString()));
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

    @GetMapping("/drivers/{id}/wins/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getDriverWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for driver {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new DriverStatistics(id.toString()));
    	List<Long> ids = stats.getStaticsForCategory(category).getWinsList().parallelStream().sorted((p1, p2) -> p1.getOrder().compareTo(p2.getOrder()))
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
     * {@code DELETE  /drivers/:id} : delete the "id" driver.
     *
     * @param id the id of the driver to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/drivers/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        log.debug("REST request to delete Driver : {}", id);
        driverRepository.deleteById(id);
        driverSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/drivers?query=:query} : search for the driver corresponding
     * to the query.
     *
     * @param query the query of the driver search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/drivers")
    @Timed
    public ResponseEntity<List<Driver>> searchDrivers(@RequestParam String query, Pageable pageable) {
    	Page<Driver> page = searchService.performWildcardSearch(driverSearchRepository, query, new String[]{"surname", "name"}, pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_typeahead/drivers")
    @Timed
    public ResponseEntity<List<DriverFullNameDTO>> typeahead(@RequestParam String query) throws URISyntaxException {
        log.debug("REST request to search for a page of Drivers for query '{}'", query);

        Page<Driver> page = searchService.performWildcardSearch(driverSearchRepository, query, new String[]{"surname", "name"}, PageRequest.of(0, 10));
        List<DriverFullNameDTO> result = new ArrayList<>();
        for (Driver driver : page) {
			result.add(new DriverFullNameDTO(driver));
		}
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}

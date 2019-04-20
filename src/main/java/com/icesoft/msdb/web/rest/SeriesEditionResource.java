package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;

import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.search.SeriesEditionSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.*;
import com.icesoft.msdb.service.impl.CacheHandler;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SeriesEdition.
 */
@RestController
@RequestMapping("/api")
public class SeriesEditionResource {

    private final Logger log = LoggerFactory.getLogger(SeriesEditionResource.class);

    private static final String ENTITY_NAME = "seriesEdition";

    private final SeriesEditionService seriesEditionService;
    private final SeriesEditionRepository seriesEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final ResultsService resultsService;
    private final StatisticsService statsService;

    @Autowired
    private CacheHandler cacheHandler;

    public SeriesEditionResource(SeriesEditionService seriesEditionService, SeriesEditionRepository seriesEditionRepository,
    		EventSessionRepository eventSessionRepository, ResultsService resultsService, StatisticsService statsService) {
        this.seriesEditionService = seriesEditionService;
    	this.seriesEditionRepository = seriesEditionRepository;
    	this.eventSessionRepository = eventSessionRepository;
    	this.resultsService = resultsService;
    	this.statsService = statsService;
    }

    /**
     * POST  /series-editions : Create a new seriesEdition.
     *
     * @param seriesEdition the seriesEdition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new seriesEdition, or with status 400 (Bad Request) if the seriesEdition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/series-editions")
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<SeriesEdition> createSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to save SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() != null) {
            throw new BadRequestAlertException("A new seriesEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SeriesEdition result = seriesEditionRepository.save(seriesEdition);
        return ResponseEntity.created(new URI("/api/series-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /series-editions : Updates an existing seriesEdition.
     *
     * @param seriesEdition the seriesEdition to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated seriesEdition,
     * or with status 400 (Bad Request) if the seriesEdition is not valid,
     * or with status 500 (Internal Server Error) if the seriesEdition couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/series-editions")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<SeriesEdition> updateSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to update SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        seriesEdition.setEvents(seriesEditionRepository.getOne(seriesEdition.getId()).getEvents());
        SeriesEdition result = seriesEditionRepository.save(seriesEdition);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, seriesEdition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /series-editions : get all the seriesEditions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of seriesEditions in body
     */
    @GetMapping("/series-editions")
    public ResponseEntity<List<SeriesEdition>> getAllSeriesEditions(Pageable pageable) {
        log.debug("REST request to get a page of SeriesEditions");
        Page<SeriesEdition> page = seriesEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/series-editions");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /series-editions/:id : get the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the seriesEdition, or with status 404 (Not Found)
     */
    @GetMapping("/series-editions/{id}")
    public ResponseEntity<SeriesEdition> getSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to get SeriesEdition : {}", id);
        Optional<SeriesEdition> seriesEdition = seriesEditionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seriesEdition);
    }

    /**
     * DELETE  /series-editions/:id : delete the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/series-editions/{id}")
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to delete SeriesEdition : {}", id);
        seriesEditionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/series-editions/{id}/standings/drivers")
    @Cacheable(cacheNames="driversStandingsCache", key="#id")
    public ResponseEntity<List<DriverPointsDTO>> getSeriesDriversStandings(@PathVariable Long id) {
    	List<DriverPointsDTO> result = resultsService.getDriversStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/standings/teams")
    @Cacheable(cacheNames="teamsStandingsCache", key="#id")
    public ResponseEntity<List<TeamPointsDTO>> getSeriesTeamsStandings(@PathVariable Long id) {
    	List<TeamPointsDTO> result = resultsService.getTeamsStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/standings/manufacturers")
    @Cacheable(cacheNames="manufacturersStandingsCache", key="#id")
    public ResponseEntity<List<ManufacturerPointsDTO>> getSeriesManufacturersStandings(@PathVariable Long id) {
    	List<ManufacturerPointsDTO> result = resultsService.getManufacturersStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/points/{category}")
    @Cacheable(cacheNames="pointRaceByRace")
    public ResponseEntity<Object[][]> getSeriesPointsRaceByRace(@PathVariable Long id, @PathVariable String category) {
    	PointsRaceByRace points = resultsService.getPointsRaceByRace(id);
    	List<DriverPointsDTO> standings = resultsService.getDriversStandings(id);
    	return new ResponseEntity<>(points.getResultsMatrix(standings, category), HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/results/{category}")
    @Cacheable(cacheNames="resultsRaceByRace")
    public ResponseEntity<String[][]> getSeriesResultsRaceByRace(@PathVariable Long id, @PathVariable String category) {
    	String[][] result = resultsService.getResultsRaceByRace(id, category);
    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/events")
    @Cacheable(cacheNames="winnersCache", key="#id")
    public ResponseEntity<List<SeriesEventsAndWinnersDTO>> getSeriesEvents(@PathVariable Long id) {
    	log.debug("REST request to retrieve all events of series edition {}", id);
    	return new ResponseEntity<>(
    			seriesEditionService.getSeriesEditionsEventsAndWinners(id), HttpStatus.OK);
    }

    @PostMapping("/series-editions/{id}/events/{idEvent}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Void> addEventToSeries(@PathVariable Long id, @PathVariable Long idEvent, @Valid @RequestBody List<EventRacePointsDTO> racesPointsData) {
    	log.debug("REST request to add an event to series {}", id);
    	cacheHandler.resetSeriesEditionCaches(seriesEditionRepository.findById(id).get());
    	seriesEditionService.addEventToSeries(id, idEvent, racesPointsData);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/series-editions/{id}/events/{idEvent}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<Void> removeEventFromSeries(@PathVariable Long id, @PathVariable Long idEvent) {
    	log.debug("REST request to remove an event from series {}", id);
        cacheHandler.resetSeriesEditionCaches(seriesEditionRepository.findById(id).get());
    	seriesEditionService.removeEventFromSeries(id, idEvent);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/series-editions/{id}/standings")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    @Transactional
    public CompletableFuture<ResponseEntity<Void>> updateSeriesStandings(@PathVariable Long id) {
    	log.debug("REST request to update series {} standings", id);
        cacheHandler.resetSeriesEditionCaches(seriesEditionRepository.findById(id).get());
    	List<EventEdition> events = seriesEditionService.findSeriesEvents(id);
    	events.stream().forEach(eventEdition -> {
    		eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(eventEdition.getId()).stream()
    			.filter(es -> !Optional.ofNullable(es.getPointsSystemsSession()).orElse(new ArrayList<>()).isEmpty())
    			.forEach(es -> resultsService.processSessionResults(es.getId()));
    			log.debug("Updating statistics...", eventEdition.getLongEventName());
    			statsService.removeEventStatistics(eventEdition);
    			statsService.buildEventStatistics(eventEdition);
    			log.debug("Statistics updated");
    	});

    	SeriesEdition seriesEd = seriesEditionRepository.findById(id)
        		.orElseThrow(() -> new MSDBException("Invalid series edition identifier: " + id));
        statsService.updateSeriesChamps(seriesEd);

        return CompletableFuture.completedFuture(ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString())).build());
    }

    @PostMapping("/series-editions/{seriesEditionId}/champions/drivers")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> updateSeriesDriversChampions(@PathVariable Long seriesEditionId, @RequestBody List<Long> selectedDriversId) {
    	seriesEditionService.setSeriesDriversChampions(seriesEditionId, selectedDriversId);
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, seriesEditionId.toString())).build();
    }

    @PostMapping("/series-editions/{seriesEditionId}/champions/teams")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> updateSeriesTeamssChampions(@PathVariable Long seriesEditionId, @RequestBody List<Long> selectedTeamsId) {
    	seriesEditionService.setSeriesTeamsChampions(seriesEditionId, selectedTeamsId);
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, seriesEditionId.toString())).build();
    }

    @GetMapping("/series-editions/{id}/champions/drivers")
    public ResponseEntity<List<SeriesDriverChampionDTO>> getSeriesEventsChampionsDrivers(@PathVariable Long id) {
    	log.debug("REST request to retrieve all champions drivers of series edition {}", id);
    	List<Driver> champs = seriesEditionService.getSeriesDriversChampions(id);

    	return new ResponseEntity<>(champs.parallelStream().map(d -> new SeriesDriverChampionDTO(d)).collect(Collectors.toList())
    			, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/champions/teams")
    public ResponseEntity<List<SeriesTeamChampionDTO>> getSeriesEventsChampionsTeams(@PathVariable Long id) {
    	log.debug("REST request to retrieve all champions drivers of series edition {}", id);
    	List<Team> champs = seriesEditionService.getSeriesTeamsChampions(id);

    	return new ResponseEntity<>(champs.parallelStream().map(t -> new SeriesTeamChampionDTO(t)).collect(Collectors.toList())
    			, HttpStatus.OK);
    }

    @PostMapping("/series-editions/{seriesEditionId}/clone")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> cloneSeriesEdition(@PathVariable Long seriesEditionId, @RequestBody String newPeriod) {
    	seriesEditionService.cloneSeriesEdition(seriesEditionId, newPeriod);
    	return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, seriesEditionId.toString())).build();
    }
}

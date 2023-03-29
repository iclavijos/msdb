package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.EventSessionRepository;
import com.icesoft.msdb.repository.jpa.SeriesEditionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.GoogleCalendarService;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.*;
import com.icesoft.msdb.service.impl.CacheHandler;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.SeriesEdition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
@RequiredArgsConstructor
public class SeriesEditionResource {

    private final Logger log = LoggerFactory.getLogger(SeriesEditionResource.class);

    private static final String ENTITY_NAME = "seriesEdition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeriesEditionService seriesEditionService;
    private final SeriesEditionRepository seriesEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final ResultsService resultsService;
    private final StatisticsService statsService;
    private final CDNService cdnService;

    @Autowired
    private CacheHandler cacheHandler;

    /**
     * {@code POST  /series-editions} : Create a new seriesEdition.
     *
     * @param seriesEdition the seriesEdition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new seriesEdition, or with status {@code 400 (Bad Request)} if the seriesEdition has already an ID.
     * @throws java.net.URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/series-editions")
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<SeriesEdition> createSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to save SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() != null) {
            throw new BadRequestAlertException("A new seriesEdition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SeriesEdition result = seriesEditionService.createSeriesEdition(seriesEdition);
        if (result.getLogo() != null) {
            String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getLogo(), ENTITY_NAME);
            result.setLogoUrl(cdnUrl);

            result = seriesEditionRepository.save(result);
        }

        return ResponseEntity.created(new URI("/api/series-editions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /series-editions} : Updates an existing seriesEdition.
     *
     * @param seriesEdition the seriesEdition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seriesEdition,
     * or with status {@code 400 (Bad Request)} if the seriesEdition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seriesEdition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/series-editions/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<SeriesEdition> updateSeriesEdition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SeriesEdition seriesEdition
    ) throws URISyntaxException {
        log.debug("REST request to update SeriesEdition : {}, {}", id, seriesEdition);
        if (seriesEdition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, seriesEdition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seriesEditionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (seriesEdition.getLogo() != null) {
            String cdnUrl = cdnService.uploadImage(seriesEdition.getId().toString(), seriesEdition.getLogo(), ENTITY_NAME);
            seriesEdition.setLogoUrl(cdnUrl);
        } else if (seriesEdition.getLogoUrl() == null) {
            cdnService.deleteImage(seriesEdition.getId().toString(), ENTITY_NAME);
        }
        SeriesEdition result = seriesEditionService.updateSeriesEdition(seriesEdition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, seriesEdition.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /series-editions} : get all the seriesEditions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seriesEditions in body.
     */
    @GetMapping("/series-editions")
    public ResponseEntity<List<SeriesEdition>> getAllSeriesEditions(Pageable pageable) {
        log.debug("REST request to get a page of SeriesEditions");
        Page<SeriesEdition> page = seriesEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /series-editions/:id} : get the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the seriesEdition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/series-editions/{id}")
    public ResponseEntity<SeriesEdition> getSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to get SeriesEdition : {}", id);
        Optional<SeriesEdition> seriesEdition = seriesEditionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seriesEdition);
    }

    /**
     * {@code DELETE  /series-editions/:id} : delete the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/series-editions/{id}")
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to delete SeriesEdition : {}", id);
        seriesEditionService.deleteSeriesEdition(seriesEditionRepository.findById(id).orElseThrow(() -> new MSDBException("Invalid series edition id " + id)));
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/series-editions/{id}/standings/drivers")
    @Cacheable(cacheNames="driversStandingsCache", key="#id")
    public ResponseEntity<List<ParticipantPointsDTO>> getSeriesDriversStandings(@PathVariable Long id) {
    	List<ParticipantPointsDTO> result = resultsService.getDriversStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/standings/teams")
    @Cacheable(cacheNames="teamsStandingsCache", key="#id")
    public ResponseEntity<List<ParticipantPointsDTO>> getSeriesTeamsStandings(@PathVariable Long id) {
    	List<ParticipantPointsDTO> result = resultsService.getTeamsStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/series-editions/{id}/standings/manufacturers")
    @Cacheable(cacheNames="manufacturersStandingsCache", key="#id")
    public ResponseEntity<List<ManufacturerPointsDTO>> getSeriesManufacturersStandings(@PathVariable Long id) {
    	List<ManufacturerPointsDTO> result = resultsService.getManufacturersStandings(id);

    	return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping({"/series-editions/{id}/points", "/series-editions/{id}/points/{category}"})
    @Cacheable(cacheNames="pointRaceByRace")
    public ResponseEntity<List<List<?>>> getSeriesPointsRaceByRace(@PathVariable Long id, @PathVariable(required = false) String category) {
        return new ResponseEntity<>(
            resultsService.getPointsRaceByRace(id, category),
            HttpStatus.OK);
    }

    @GetMapping({"/series-editions/{id}/results", "/series-editions/{id}/results/{category}"})
    @Cacheable(cacheNames="resultsRaceByRace")
    public ResponseEntity<List<List<?>>> getSeriesResultsRaceByRace(@PathVariable Long id, @PathVariable(required = false) String category) {
    	return new ResponseEntity<>(
    	    resultsService.getResultsRaceByRace(id, category),
            HttpStatus.OK);
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
    	SeriesEdition seriesEdition = seriesEditionRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Unknown series edition id " + id));
    	cacheHandler.resetSeriesEditionCaches(seriesEdition);
    	seriesEditionService.addEventToSeries(id, idEvent, racesPointsData);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @DeleteMapping("/series-editions/{id}/events/{idEvent}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    public ResponseEntity<Void> removeEventFromSeries(@PathVariable Long id, @PathVariable Long idEvent) {
    	log.debug("REST request to remove an event from series {}", id);
        SeriesEdition seriesEdition = seriesEditionRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Unknown series edition id " + id));
        cacheHandler.resetSeriesEditionCaches(seriesEdition);
    	seriesEditionService.removeEventFromSeries(id, idEvent);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/series-editions/{id}/standings")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    //@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
    @Transactional
    public CompletableFuture<ResponseEntity<Void>> updateSeriesStandings(@PathVariable Long id) {
    	log.debug("REST request to update series {} standings", id);
        SeriesEdition seriesEdition = seriesEditionRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Unknown series edition id " + id));
        cacheHandler.resetSeriesEditionCaches(seriesEdition);
    	List<EventEdition> events = seriesEditionService.findSeriesEvents(id);
    	events.stream().forEach(eventEdition -> {
    		eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(eventEdition.getId()).stream()
    			.filter(es -> !Optional.ofNullable(es.getPointsSystemsSession()).orElse(new HashSet<>()).isEmpty())
    			.forEach(es -> resultsService.processSessionResults(es.getId()));
    			log.debug("Updating statistics...", eventEdition.getLongEventName());
    			statsService.removeEventStatistics(eventEdition);
    			statsService.buildEventStatistics(eventEdition);
    			log.debug("Statistics updated");
    	});

        statsService.updateSeriesDriversChampions(seriesEdition);

        return CompletableFuture.completedFuture(ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString())).build());
    }

    @PostMapping("/series-editions/{seriesEditionId}/champions/drivers")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> updateSeriesDriversChampions(@PathVariable Long seriesEditionId, @RequestBody List<DriverCategoryChampionDTO> selectedDrivers) {
    	seriesEditionService.setSeriesDriversChampions(seriesEditionId, selectedDrivers);
    	return ResponseEntity.ok().headers(
    	    HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, seriesEditionId.toString())).build();
    }

    @PostMapping("/series-editions/{seriesEditionId}/champions/teams")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @Transactional
    public ResponseEntity<Void> updateSeriesTeamsChampions(@PathVariable Long seriesEditionId, @RequestBody List<Long> selectedTeamsId) {
    	seriesEditionService.setSeriesTeamsChampions(seriesEditionId, selectedTeamsId);
    	return ResponseEntity.ok().headers(
    	    HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, seriesEditionId.toString())).build();
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
    	return ResponseEntity.ok().headers(
    	    HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, seriesEditionId.toString())).build();
    }

    @GetMapping("/series-editions/{id}/prevNextEdition")
    @Transactional(readOnly=true)
    public EventsSeriesNavigationDTO getPrevNextEditionIds(@PathVariable Long id) {
        SeriesEdition seriesEdition = seriesEditionRepository.findById(id).orElseThrow(
            () -> new MSDBException("Invalid series edition id")
        );
        List<SeriesEdition> tmpList = seriesEditionRepository.findBySeriesId(seriesEdition.getSeries().getId(), Pageable.unpaged()).getContent();

        int pos = tmpList.indexOf(
            tmpList.stream().filter(se -> se.getId().equals(seriesEdition.getId())).findFirst().get()
        );
        Optional<SeriesEdition> prev = Optional.ofNullable(pos > 0 ? tmpList.get(pos - 1) : null);
        Optional<SeriesEdition> next = Optional.ofNullable(pos < tmpList.size() - 1 ? tmpList.get(pos + 1) : null);

        EventsSeriesNavigationDTO result = new EventsSeriesNavigationDTO(
            prev.map(se -> se.getId()).orElse(null),
            next.map(se -> se.getId()).orElse(null),
            prev.map(se -> se.getEditionName()).orElse(null),
            next.map(se -> se.getEditionName()).orElse(null)
        );
        return result;
    }
}

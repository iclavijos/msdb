package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;
import com.icesoft.msdb.service.dto.TeamPointsDTO;
import com.icesoft.msdb.service.impl.ResultsService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

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
    private final ResultsService resultsService;

    public SeriesEditionResource(SeriesEditionService seriesEditionService, SeriesEditionRepository seriesEditionRepository, ResultsService resultsService) {
        this.seriesEditionService = seriesEditionService;
    	this.seriesEditionRepository = seriesEditionRepository;
    	this.resultsService = resultsService;
    }

    /**
     * POST  /series-editions : Create a new seriesEdition.
     *
     * @param seriesEdition the seriesEdition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new seriesEdition, or with status 400 (Bad Request) if the seriesEdition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/series-editions")
    @Timed
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<SeriesEdition> createSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to save SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new seriesEdition cannot already have an ID")).body(null);
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
     * or with status 500 (Internal Server Error) if the seriesEdition couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/series-editions")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<SeriesEdition> updateSeriesEdition(@Valid @RequestBody SeriesEdition seriesEdition) throws URISyntaxException {
        log.debug("REST request to update SeriesEdition : {}", seriesEdition);
        if (seriesEdition.getId() == null) {
            return createSeriesEdition(seriesEdition);
        }
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
    @Timed
    public ResponseEntity<List<SeriesEdition>> getAllSeriesEditions(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of SeriesEditions");
        Page<SeriesEdition> page = seriesEditionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/series-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /series-editions/:id : get the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the seriesEdition, or with status 404 (Not Found)
     */
    @GetMapping("/series-editions/{id}")
    @Timed
    public ResponseEntity<SeriesEdition> getSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to get SeriesEdition : {}", id);
        SeriesEdition seriesEdition = seriesEditionRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(seriesEdition));
    }

    /**
     * DELETE  /series-editions/:id : delete the "id" seriesEdition.
     *
     * @param id the id of the seriesEdition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/series-editions/{id}")
    @Timed
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeriesEdition(@PathVariable Long id) {
        log.debug("REST request to delete SeriesEdition : {}", id);
        seriesEditionRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/series-editions?query=:query : search for the seriesEdition corresponding
     * to the query.
     *
     * @param query the query of the seriesEdition search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/series-editions")
    @Timed
    public ResponseEntity<List<SeriesEdition>> searchSeriesEditions(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of SeriesEditions for query {}", query);
        //TODO: Implement proper search
        Page<SeriesEdition> page = seriesEditionRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/series-editions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/series-editions/{id}/standings/drivers")
    @Timed
    @Cacheable(cacheNames="driversStandingsCache", key="#id")
    public ResponseEntity<List<DriverPointsDTO>> getSeriesDriversStandings(@PathVariable Long id) {
    	List<DriverPointsDTO> result = resultsService.getDriversStandings(id);
    	
    	return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping("/series-editions/{id}/standings/teams")
    @Timed
    @Cacheable(cacheNames="teamsStandingsCache", key="#id")
    public ResponseEntity<List<TeamPointsDTO>> getSeriesTeamssStandings(@PathVariable Long id) {
    	List<TeamPointsDTO> result = resultsService.getTeamsStandings(id);
    	
    	return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping("/series-editions/{id}/events")
    @Timed
    public ResponseEntity<List<EventEdition>> getSeriesEvents(@PathVariable Long id) {
    	log.debug("REST request to retrieve all events of series edition {}", id);
    	return new ResponseEntity<>(
    			seriesEditionService.findSeriesEvents(id), HttpStatus.OK);
    }
    
    @PostMapping("/series-editions/{id}/events/{idEvent}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Void> addEventToSeries(@PathVariable Long id, @PathVariable Long idEvent, @Valid @RequestBody List<EventRacePointsDTO> racesPointsData) {
    	log.debug("REST request to add an event to series {}", id);
    	seriesEditionService.addEventToSeries(id, idEvent, racesPointsData);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString())).build();
    }
    
    @DeleteMapping("/series-editions/{id}/events/{idEvent}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Void> removeEventFromSeries(@PathVariable Long id, @PathVariable Long idEvent) {
    	log.debug("REST request to remove an event from series {}", id);
    	seriesEditionService.removeEventFromSeries(id, idEvent);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}

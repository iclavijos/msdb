package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
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
import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.domain.stats.ElementStatistics;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.repository.stats.TeamStatisticsRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Team.
 */
@RestController
@RequestMapping("/api")
public class TeamResource {

    private final Logger log = LoggerFactory.getLogger(TeamResource.class);

    private static final String ENTITY_NAME = "team";
        
    private final TeamRepository teamRepository;
    private final EventEntryRepository entryRepository;
    
    private final TeamStatisticsRepository statsRepo;
    
    private final CDNService cdnService;


    public TeamResource(TeamRepository teamRepository, EventEntryRepository entryRepository, 
    		TeamStatisticsRepository statsRepo, CDNService cdnService) {
        this.teamRepository = teamRepository;
        this.entryRepository = entryRepository;
        this.statsRepo = statsRepo;
        this.cdnService = cdnService;
    }

    /**
     * POST  /teams : Create a new team.
     *
     * @param team the team to create
     * @return the ResponseEntity with status 201 (Created) and with body the new team, or with status 400 (Bad Request) if the team has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/teams")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to save Team : {}", team);
        if (team.getId() != null) {
            throw new BadRequestAlertException("A new team cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Team result = teamRepository.save(team);
        if (team.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(team.getId().toString(), team.getLogo(), ENTITY_NAME);
			team.logoUrl(cdnUrl);
			
			result = teamRepository.save(result);
        }
        return ResponseEntity.created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /teams : Updates an existing team.
     *
     * @param team the team to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated team,
     * or with status 400 (Bad Request) if the team is not valid,
     * or with status 500 (Internal Server Error) if the team couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/teams")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Team> updateTeam(@Valid @RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to update Team : {}", team);
        if (team.getId() == null) {
            return createTeam(team);
        }
        if (team.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(team.getId().toString(), team.getLogo(), ENTITY_NAME);
			team.logoUrl(cdnUrl);
        } else if (team.getLogoUrl() == null) {
        	cdnService.deleteImage(team.getId().toString(), ENTITY_NAME);
        }
        Team result = teamRepository.save(team);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, team.getId().toString()))
            .body(result);
    }

    /**
     * GET  /teams : get all the teams.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of teams in body
     */
    @GetMapping("/teams")
    @Timed
    public ResponseEntity<List<Team>> getAllTeams(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Teams");
        Page<Team> page = teamRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/teams");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /teams/:id : get the "id" team.
     *
     * @param id the id of the team to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the team, or with status 404 (Not Found)
     */
    @GetMapping("/teams/{id}")
    @Timed
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        Team team = teamRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(team));
    }
    
    @GetMapping("/teams/{id}/participations/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getTeamParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for driver {} in category {}", id, category);
    	ElementStatistics stats = statsRepo.findOne(id.toString());
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
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/teams/%s/participations/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/teams/{id}/wins/{category}")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> getTeamWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for driver {} in category {}", id, category);
    	ElementStatistics stats = statsRepo.findOne(id.toString());
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
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/teams/%s/wins/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * DELETE  /teams/:id : delete the "id" team.
     *
     * @param id the id of the team to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/teams/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        log.debug("REST request to delete Team : {}", id);
        teamRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/teams")
    @Timed
    public ResponseEntity<List<Team>> searchTeams(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Teams for query '{}'", query);
        Page<Team> page = teamRepository.findByNameContainsIgnoreCaseOrderByNameAsc(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/teams");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    /**
     * SEARCH  /_search/teams?query=:query : search for the team corresponding
     * to the query.
     *
     * @param query the query of the team search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_typeahead/teams")
    @Timed
    public List<Team> typeahead(@RequestParam String query) {
        log.debug("REST request to search Teams for query {}", query);
        Page<Team> result = teamRepository.findByNameContainsIgnoreCaseOrderByNameAsc(query, new PageRequest(0, 5));

        return result.getContent();
    }


}

package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.repository.search.TeamSearchRepository;
import com.icesoft.msdb.repository.stats.TeamStatisticsRepository;
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
import org.springframework.cache.annotation.CacheEvict;
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

    private final TeamSearchRepository teamSearchRepository;

    public TeamResource(TeamRepository teamRepository, TeamSearchRepository teamSearchRepository,
    		EventEntryRepository entryRepository,
    		TeamStatisticsRepository statsRepo, CDNService cdnService) {
        this.teamRepository = teamRepository;
        this.teamSearchRepository = teamSearchRepository;
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
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to save Team : {}", team);
        if (team.getId() != null) {
            throw new BadRequestAlertException("A new team cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Team result = teamRepository.save(team);
        teamSearchRepository.save(result);
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
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Team> updateTeam(@Valid @RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to update Team : {}", team);
        if (team.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (team.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(team.getId().toString(), team.getLogo(), ENTITY_NAME);
			team.logoUrl(cdnUrl);
        } else if (team.getLogoUrl() == null) {
        	cdnService.deleteImage(team.getId().toString(), ENTITY_NAME);
        }
        Team result = teamRepository.save(team);
        teamSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, team.getId().toString()))
            .body(result);
    }

    /**
     * GET  /teams : get all the teams.
     *
     * @param pageable the pagination information
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of teams in body
     */
    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
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
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        Optional<Team> team = teamRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(team);
    }

    @GetMapping("/teams/{id}/participations/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getTeamParticipations(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get participations for driver {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).get();
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
    	HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders("", page, String.format("/teams/%s/participations/%s", id, category));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/teams/{id}/wins/{category}")
    public ResponseEntity<List<EventEntrySearchResultDTO>> getTeamWins(@PathVariable Long id, @PathVariable String category, Pageable pageable) {
    	log.debug("REST request to get wins for driver {} in category {}", id, category);
    	ParticipantStatisticsSnapshot stats = statsRepo.findById(id.toString()).orElse(new TeamStatistics(id.toString()));
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
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        log.debug("REST request to delete Team : {}", id);
        teamRepository.deleteById(id);
        teamSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/_search/teams")
    public ResponseEntity<List<Team>> searchTeams(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Teams for query '{}'", query);
        Page<Team> page = performSearch(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/teams");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * SEARCH  /_search/teams?query=:query : search for the team corresponding
     * to the query.
     *
     * @param query the query of the team search
     * @return the result of the search
     */
    @GetMapping("/_typeahead/teams")
    public List<Team> typeahead(@RequestParam String query) {
        log.debug("REST request to search Teams for query {}", query);
        Page<Team> result = performSearch(query, PageRequest.of(0, 5));

        return result.getContent();
    }

    private Page<Team> performSearch(String query, Pageable pageable) {
        QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
            QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
                .analyzeWildcard(true)
                .field("name"));

        return teamSearchRepository.search(queryBuilder, pageable);
    }

}

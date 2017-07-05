package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.dto.RacetrackLayoutSearchResultDTO;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing RacetrackLayout.
 */
@RestController
@RequestMapping("/api")
public class RacetrackLayoutResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackLayoutResource.class);

    private static final String ENTITY_NAME = "racetrackLayout";
        
    private final RacetrackLayoutRepository racetrackLayoutRepository;
    
    private final CDNService cdnService;

    public RacetrackLayoutResource(RacetrackLayoutRepository racetrackLayoutRepository, CDNService cdnService) {
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.cdnService = cdnService;
    }

    /**
     * POST  /racetrack-layouts : Create a new racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to create
     * @return the ResponseEntity with status 201 (Created) and with body the new racetrackLayout, or with status 400 (Bad Request) if the racetrackLayout has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/racetrack-layouts")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> createRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to save RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new racetrackLayout cannot already have an ID")).body(null);
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
      
        if (result.getLayoutImage() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), racetrackLayout.getLayoutImage(), ENTITY_NAME);
			result.setLayoutImageUrl(cdnUrl);
			
			result = racetrackLayoutRepository.save(result);
        }
        
        return ResponseEntity.created(new URI("/api/racetrack-layouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /racetrack-layouts : Updates an existing racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated racetrackLayout,
     * or with status 400 (Bad Request) if the racetrackLayout is not valid,
     * or with status 500 (Internal Server Error) if the racetrackLayout couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/racetrack-layouts")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> updateRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to update RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() == null) {
            return createRacetrackLayout(racetrackLayout);
        }
        if (racetrackLayout.getLayoutImage() != null) {
	        String cdnUrl = cdnService.uploadImage(racetrackLayout.getId().toString(), racetrackLayout.getLayoutImage(), ENTITY_NAME);
	        racetrackLayout.setLayoutImageUrl(cdnUrl);
        } else if (racetrackLayout.getLayoutImageUrl() == null) {
        	cdnService.deleteImage(racetrackLayout.getId().toString(), ENTITY_NAME);
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, racetrackLayout.getId().toString()))
            .body(result);
    }

    /**
     * GET  /racetrack-layouts : get all the racetrackLayouts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of racetrackLayouts in body
     */
    @GetMapping("/racetrack-layouts")
    @Timed
    public List<RacetrackLayout> getAllRacetrackLayouts() {
        log.debug("REST request to get all RacetrackLayouts");
        List<RacetrackLayout> racetrackLayouts = racetrackLayoutRepository.findAll();
        return racetrackLayouts;
    }

    /**
     * GET  /racetrack-layouts/:id : get the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the racetrackLayout, or with status 404 (Not Found)
     */
    @GetMapping("/racetrack-layouts/{id}")
    @Timed
    public ResponseEntity<RacetrackLayout> getRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to get RacetrackLayout : {}", id);
        RacetrackLayout racetrackLayout = racetrackLayoutRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(racetrackLayout));
    }

    /**
     * DELETE  /racetrack-layouts/:id : delete the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/racetrack-layouts/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to delete RacetrackLayout : {}", id);
        racetrackLayoutRepository.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/racetrack-layouts?query=:query : search for the racetrackLayout corresponding
     * to the query.
     *
     * @param query the query of the racetrackLayout search 
     * @return the result of the search
     */
    @GetMapping("/_search/layouts")
    @Timed
    public ResponseEntity<List<RacetrackLayout>> searchRacetrackLayouts(@RequestParam String query, @ApiParam Pageable pageable) throws URISyntaxException {
        log.debug("REST request to search RacetracksLayouts for query {}", query);
        Page<RacetrackLayout> page = racetrackLayoutRepository.search(query.toLowerCase(), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/layouts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping("/_typeahead/layouts")
    @Timed
    public List<RacetrackLayoutSearchResultDTO> searchTypeaheadLayouts(@RequestParam String query) {
    	log.debug("REST request to search RacetracksLayouts for query {}", query);
        Page<RacetrackLayout> page = racetrackLayoutRepository.search(query.toLowerCase(), new PageRequest(0, 20));
        List<RacetrackLayoutSearchResultDTO> result = new ArrayList<>();
        for (RacetrackLayout layout : page.getContent()) {
			result.add(new RacetrackLayoutSearchResultDTO(layout));
		}
        return result;
    }


}

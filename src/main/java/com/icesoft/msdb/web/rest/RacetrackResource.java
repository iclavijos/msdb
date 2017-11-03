package com.icesoft.msdb.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
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
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.RacetrackService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import com.icesoft.msdb.web.rest.util.HeaderUtil;
import com.icesoft.msdb.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Racetrack.
 */
@RestController
@RequestMapping("/api")
public class RacetrackResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackResource.class);

    private static final String ENTITY_NAME = "racetrack";
    private static final String ENTITY_NAME_LAYOUT = "racetrackLayout";

    private final RacetrackService racetrackService;
    
    //TODO: move code inside service and change presentation layer to adapt to new URL's
    @Autowired private RacetrackLayoutRepository racetrackLayoutRepository;
    
    private final CDNService cdnService;

    public RacetrackResource(RacetrackService racetrackService, CDNService cdnService) {
        this.racetrackService = racetrackService;
        this.cdnService = cdnService;
    }

    /**
     * POST  /racetracks : Create a new racetrack.
     *
     * @param racetrack the racetrack to create
     * @return the ResponseEntity with status 201 (Created) and with body the new racetrack, or with status 400 (Bad Request) if the racetrack has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/racetracks")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Racetrack> createRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to save Racetrack : {}", racetrack);
        if (racetrack.getId() != null) {
            throw new BadRequestAlertException("A new racetrack cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Racetrack result = racetrackService.save(racetrack);
        if (result.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getLogo(), ENTITY_NAME);
			result.setLogoUrl(cdnUrl);
			
			result = racetrackService.save(result);
        }
        return ResponseEntity.created(new URI("/api/racetracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /racetracks : Updates an existing racetrack.
     *
     * @param racetrack the racetrack to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated racetrack,
     * or with status 400 (Bad Request) if the racetrack is not valid,
     * or with status 500 (Internal Server Error) if the racetrack couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/racetracks")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Racetrack> updateRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to update Racetrack : {}", racetrack);
        if (racetrack.getId() == null) {
            return createRacetrack(racetrack);
        }
        if (racetrack.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(racetrack.getId().toString(), racetrack.getLogo(), ENTITY_NAME);
	        racetrack.setLogoUrl(cdnUrl);
        } else if (racetrack.getLogoUrl() == null) {
        	cdnService.deleteImage(racetrack.getId().toString(), ENTITY_NAME);
        }
        Racetrack result = racetrackService.save(racetrack);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, racetrack.getId().toString()))
            .body(result);
    }

    /**
     * GET  /racetracks : get all the racetracks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of racetracks in body
     */
    @GetMapping("/racetracks")
    @Timed
    public ResponseEntity<List<Racetrack>> getAllRacetracks(Pageable pageable) {
        log.debug("REST request to get all Racetracks");
        Page<Racetrack> page = racetrackService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/racetracks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /racetracks/:id : get the "id" racetrack.
     *
     * @param id the id of the racetrack to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the racetrack, or with status 404 (Not Found)
     */
    @GetMapping("/racetracks/{id}")
    @Timed
    public ResponseEntity<Racetrack> getRacetrack(@PathVariable Long id) {
        log.debug("REST request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(racetrack));
    }
    
    /**
     * GET  /racetracks/:id/layouts : get the layouts of "id" racetrack.
     *
     * @param id the id of the racetrack layouts to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the list of layouts, or with status 404 (Not Found)
     */
    @GetMapping("/racetracks/{id}/layouts")
    @Timed
    public List<RacetrackLayout> getRacetrackLayouts(@PathVariable Long id) {
        log.debug("REST request to get Racetrack layouts : {}", id);
        return racetrackService.findRacetrackLayouts(id);
    }

    /**
     * DELETE  /racetracks/:id : delete the "id" racetrack.
     *
     * @param id the id of the racetrack to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/racetracks/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteRacetrack(@PathVariable Long id) {
        log.debug("REST request to delete Racetrack : {}", id);
        racetrackService.delete(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/racetracks?query=:query : search for the racetrack corresponding
     * to the query.
     *
     * @param query the query of the racetrack search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/racetracks")
    @Timed
    public ResponseEntity<List<Racetrack>> searchRacetracks(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search Racetracks for query {}", query);
        Page<Racetrack> page = racetrackService.search(query.toLowerCase(), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/racetracks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    /**
     * POST  /racetrack-layouts : Create a new racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to create
     * @return the ResponseEntity with status 201 (Created) and with body the new racetrackLayout, or with status 400 (Bad Request) if the racetrackLayout has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/racetracks/{id}/racetrack-layouts")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> createRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to save RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new racetrackLayout cannot already have an ID")).body(null);
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
      
        if (result.getLayoutImageUrl() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), racetrackLayout.getLayoutImage(), ENTITY_NAME_LAYOUT);
			result.setLayoutImageUrl(cdnUrl);
			
			result = racetrackLayoutRepository.save(result);
        }
        
        return ResponseEntity.created(new URI("/api/racetrack-layouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME_LAYOUT, result.getId().toString()))
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
    @PutMapping("/racetracks/{id}/racetrack-layouts")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> updateRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to update RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() == null) {
            return createRacetrackLayout(racetrackLayout);
        }
        if (racetrackLayout.getLayoutImage() != null) {
	        String cdnUrl = cdnService.uploadImage(racetrackLayout.getId().toString(), racetrackLayout.getLayoutImage(), ENTITY_NAME_LAYOUT);
	        racetrackLayout.setLayoutImageUrl(cdnUrl);
        } else if (racetrackLayout.getLayoutImageUrl() == null) {
        	cdnService.deleteImage(racetrackLayout.getId().toString(), ENTITY_NAME_LAYOUT);
        }
        RacetrackLayout result = racetrackLayoutRepository.save(racetrackLayout);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME_LAYOUT, racetrackLayout.getId().toString()))
            .body(result);
    }

    /**
     * GET  /racetrack-layouts : get all the racetrackLayouts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of racetrackLayouts in body
     */
    @GetMapping("/racetracks/{id}/racetrack-layouts")
    @Timed
    public List<RacetrackLayout> getAllRacetrackLayouts() {
        log.debug("REST request to get all RacetrackLayouts");
        List<RacetrackLayout> racetrackLayouts = racetrackLayoutRepository.findAll();
        return racetrackLayouts;
    }


}

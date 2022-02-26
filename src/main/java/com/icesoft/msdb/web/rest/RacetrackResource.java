package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.RacetrackService;
import com.icesoft.msdb.service.dto.EventEditionWinnersDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.Racetrack}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RacetrackResource {

    private final Logger log = LoggerFactory.getLogger(RacetrackResource.class);

    private static final String ENTITY_NAME = "racetrack";
    private static final String ENTITY_NAME_LAYOUT = "racetrackLayout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RacetrackService racetrackService;

    public RacetrackResource(RacetrackService racetrackService) {
        this.racetrackService = racetrackService;
    }

    /**
     * {@code POST  /racetracks} : Create a new racetrack.
     *
     * @param racetrack the racetrack to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new racetrack, or with status {@code 400 (Bad Request)} if the racetrack has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/racetracks")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Racetrack> createRacetrack(@Valid @RequestBody Racetrack racetrack) throws URISyntaxException {
        log.debug("REST request to save Racetrack : {}", racetrack);
        if (racetrack.getId() != null) {
            throw new BadRequestAlertException("A new racetrack cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Racetrack result = racetrackService.save(racetrack);

        return ResponseEntity
            .created(new URI("/api/racetracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /racetracks/:id} : Updates an existing racetrack.
     *
     * @param id the id of the racetrack to save.
     * @param racetrack the racetrack to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated racetrack,
     * or with status {@code 400 (Bad Request)} if the racetrack is not valid,
     * or with status {@code 500 (Internal Server Error)} if the racetrack couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/racetracks/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Racetrack> updateRacetrack(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Racetrack racetrack
    ) throws URISyntaxException {
        log.debug("REST request to update Racetrack : {}, {}", id, racetrack);
        if (racetrack.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, racetrack.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Racetrack result = racetrackService.save(racetrack);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, racetrack.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /racetracks} : get all the racetracks.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of racetracks in body.
     */
    @GetMapping("/racetracks")
    public ResponseEntity<List<Racetrack>> getAllRacetracks(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to get a page of Racetracks");
        Page<Racetrack> page = racetrackService.findRacetracks(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /racetracks/:id} : get the "id" racetrack.
     *
     * @param id the id of the racetrack to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the racetrack, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/racetracks/{id}")
    public ResponseEntity<Racetrack> getRacetrack(@PathVariable Long id) {
        log.debug("REST request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackService.find(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(racetrack));
    }

    /**
     * GET  /racetracks/:id/layouts : get the layouts of "id" racetrack.
     *
     * @param id the id of the racetrack layouts to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the list of layouts, or with status 404 (Not Found)
     */
    @GetMapping("/racetracks/{id}/layouts")
    public List<RacetrackLayout> getRacetrackLayouts(@PathVariable Long id) {
        log.debug("REST request to get Racetrack layouts : {}", id);
        return racetrackService.findRacetrackLayouts(id);
    }

    /**
     * {@code DELETE  /racetracks/:id} : delete the "id" racetrack.
     *
     * @param id the id of the racetrack to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/racetracks/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    @CacheEvict(cacheNames="homeInfo", allEntries=true)
    public ResponseEntity<Void> deleteRacetrack(@PathVariable Long id) {
        log.debug("REST request to delete Racetrack : {}", id);
        racetrackService.delete(id);

        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/racetracks?query=:query} : search for the racetrack corresponding
     * to the query.
     *
     * @param query the query of the racetrack search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/racetracks")
    public ResponseEntity<List<Racetrack>> searchRacetracks(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Racetracks for query {}", query);
        Page<Racetrack> page = racetrackService.search(query.toLowerCase(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * POST  /racetrack-layouts : Create a new racetrackLayout.
     *
     * @param racetrackLayout the racetrackLayout to create
     * @return the ResponseEntity with status 201 (Created) and with body the new racetrackLayout, or with status 400 (Bad Request) if the racetrackLayout has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/racetrack-layouts")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> createRacetrackLayout(@Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {
        log.debug("REST request to save RacetrackLayout : {}", racetrackLayout);
        if (racetrackLayout.getId() != null) {
            return ResponseEntity.badRequest().headers(
                HeaderUtil
                    .createFailureAlert(applicationName, false, ENTITY_NAME, "idexists", "A new racetrackLayout cannot already have an ID"))
                .body(null);
        }
        RacetrackLayout result = racetrackService.save(racetrackLayout);

        return ResponseEntity.created(new URI("/api/racetrack-layouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME_LAYOUT, result.getId().toString()))
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
    @PutMapping("/racetrack-layouts/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<RacetrackLayout> updateRacetrackLayout(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RacetrackLayout racetrackLayout) throws URISyntaxException {

        log.debug("REST request to update RacetrackLayout : {}, {}", id, racetrackLayout);
        if (!Objects.equals(id, racetrackLayout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (racetrackLayout.getId() == null) {
            return createRacetrackLayout(racetrackLayout);
        }

        RacetrackLayout result = racetrackService.save(racetrackLayout);
        return ResponseEntity.ok()
            .headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME_LAYOUT, racetrackLayout.getId().toString()))
            .body(result);
    }

    /**
     * GET  /racetrack-layouts/:id : get the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the racetrackLayout, or with status 404 (Not Found)
     */
    @GetMapping("/racetrack-layouts/{id}")
    public ResponseEntity<RacetrackLayout> getRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to get RacetrackLayout : {}", id);
        RacetrackLayout racetrackLayout = racetrackService.findLayout(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(racetrackLayout));
    }

    /**
     * DELETE  /racetrack-layouts/:id : delete the "id" racetrackLayout.
     *
     * @param id the id of the racetrackLayout to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/racetrack-layouts/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteRacetrackLayout(@PathVariable Long id) {
        log.debug("REST request to delete RacetrackLayout : {}", id);
        racetrackService.deleteLayout(id);
        return ResponseEntity.ok().headers(HeaderUtil
            .createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * GET  /racetrack-layouts : get all the racetrackLayouts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of racetrackLayouts in body
     */
    @GetMapping("/racetracks/{id}/racetrack-layouts")
    public List<RacetrackLayout> getAllRacetrackLayouts(@PathVariable Long id) {
        log.debug("REST request to get all RacetrackLayouts");
        List<RacetrackLayout> racetrackLayouts = racetrackService.findRacetrackLayouts(id);
        return racetrackLayouts;
    }

    /**
     * GET  /events : get next or previous events.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of events in body
     */
    @GetMapping("/racetracks/{id}/events")
    public ResponseEntity<List<EventEditionWinnersDTO>> getRacetrackEvents(@PathVariable Long id, @RequestParam String type, Pageable page) {
        log.debug("REST request to get {} events to happen at racetrack {}", type, id);
        Page<EventEditionWinnersDTO> eventsEditions = null;
        if (type.equals("future")) {
            eventsEditions = new PageImpl<>(racetrackService.findNextEvents(id).stream()
                .map(eventEdition -> new EventEditionWinnersDTO(eventEdition))
                .collect(Collectors.toList()));
        } else {
            eventsEditions = racetrackService.findPreviousEvents(id, page);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), eventsEditions);
        return ResponseEntity.ok().headers(headers).body(eventsEditions.getContent());
    }

    @GetMapping("/_search/racetrack-layouts")
    public List<RacetrackLayout> searchTypeaheadLayouts(@RequestParam String query) {
    	log.debug("REST request to search RacetracksLayouts for query {}", query);
        Page<RacetrackLayout> page = racetrackService.searchLayouts(query, PageRequest.of(0, 20));
        return page.getContent();
    }

}

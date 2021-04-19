package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.PointsSystem;

import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.search.PointsSystemSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.PointsSystem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PointsSystemResource {

    private final Logger log = LoggerFactory.getLogger(PointsSystemResource.class);

    private static final String ENTITY_NAME = "pointsSystem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointsSystemRepository pointsSystemRepository;

    private final PointsSystemSearchRepository pointsSystemSearchRepository;
    private final SearchService searchService;

    public PointsSystemResource(PointsSystemRepository pointsSystemRepository, PointsSystemSearchRepository pointsSystemSearchRepository,
                                SearchService searchService) {
        this.pointsSystemRepository = pointsSystemRepository;
        this.pointsSystemSearchRepository = pointsSystemSearchRepository;
        this.searchService = searchService;
    }

    /**
     * {@code POST  /points-systems} : Create a new pointsSystem.
     *
     * @param pointsSystem the pointsSystem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pointsSystem, or with status {@code 400 (Bad Request)} if the pointsSystem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/points-systems")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<PointsSystem> createPointsSystem(@Valid @RequestBody PointsSystem pointsSystem) throws URISyntaxException {
        log.debug("REST request to save PointsSystem : {}", pointsSystem);
        if (pointsSystem.getId() != null) {
            throw new BadRequestAlertException("A new pointsSystem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PointsSystem result = pointsSystemRepository.save(pointsSystem);
        pointsSystemSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points-systems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /points-systems} : Updates an existing pointsSystem.
     *
     * @param pointsSystem the pointsSystem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pointsSystem,
     * or with status {@code 400 (Bad Request)} if the pointsSystem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pointsSystem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/points-systems")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<PointsSystem> updatePointsSystem(@Valid @RequestBody PointsSystem pointsSystem) throws URISyntaxException {
        log.debug("REST request to update PointsSystem : {}", pointsSystem);
        if (pointsSystem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PointsSystem result = pointsSystemRepository.save(pointsSystem);
        pointsSystemSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pointsSystem.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /points-systems} : get all the pointsSystems.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pointsSystems in body.
     */
    @GetMapping("/points-systems")
    @Timed
    public ResponseEntity<List<PointsSystem>> getPointsSystems(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to get a page of PointsSystems");
        Page<PointsSystem> page;

        if (StringUtils.isNotEmpty(query)) {
            page = searchService.performWildcardSearch(pointsSystemSearchRepository, query.toLowerCase(), new String[]{"name", "description"}, pageable);
        } else {
            page = pointsSystemRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /points-systems/:id} : get the "id" pointsSystem.
     *
     * @param id the id of the pointsSystem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pointsSystem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points-systems/{id}")
    @Timed
    public ResponseEntity<PointsSystem> getPointsSystem(@PathVariable Long id) {
        log.debug("REST request to get PointsSystem : {}", id);
        Optional<PointsSystem> pointsSystem = pointsSystemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pointsSystem);
    }

    /**
     * {@code DELETE  /points-systems/:id} : delete the "id" pointsSystem.
     *
     * @param id the id of the pointsSystem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/points-systems/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deletePointsSystem(@PathVariable Long id) {
        log.debug("REST request to delete PointsSystem : {}", id);
        pointsSystemRepository.deleteById(id);
        pointsSystemSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}

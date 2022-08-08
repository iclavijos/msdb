package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.domain.Series;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.jpa.SeriesEditionRepository;
import com.icesoft.msdb.repository.jpa.SeriesRepository;
import com.icesoft.msdb.repository.search.SeriesSearchRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.EditionIdYearDTO;
import com.icesoft.msdb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

/**
 * REST controller for managing {@link com.icesoft.msdb.domain.Series}.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional
public class SeriesResource {

    private final Logger log = LoggerFactory.getLogger(SeriesResource.class);

    private static final String ENTITY_NAME = "series";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeriesRepository seriesRepository;

    private final SeriesSearchRepository seriesSearchRepository;
    private final SeriesEditionRepository seriesEditionRepository;
    private final SearchService searchService;
    private final CDNService cdnService;


    /**
     * {@code POST  /series} : Create a new series.
     *
     * @param series the series to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new series, or with status {@code 400 (Bad Request)} if the series has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/series")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> createSeries(@Valid @RequestBody Series series) throws URISyntaxException {
        log.debug("REST request to save Series : {}", series);
        if (series.getId() != null) {
            throw new BadRequestAlertException("A new series cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
        if (result.getLogo() != null) {
	        String cdnUrl = cdnService.uploadImage(result.getId().toString(), result.getLogo(), ENTITY_NAME);
			result.setLogoUrl(cdnUrl);

			result = seriesRepository.save(result);
        }
        return ResponseEntity
            .created(new URI("/api/series/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /series/:id} : Updates an existing series.
     *
     * @param id the id of the series to save.
     * @param series the series to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated series,
     * or with status {@code 400 (Bad Request)} if the series is not valid,
     * or with status {@code 500 (Internal Server Error)} if the series couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/series/{id}")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.EDITOR})
    public ResponseEntity<Series> updateSeries(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Series series
    ) throws URISyntaxException {
        log.debug("REST request to update Series : {}, {}", id, series);
        if (series.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, series.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seriesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (series.getLogo() != null) {
        	String cdnUrl = cdnService.uploadImage(series.getId().toString(), series.getLogo(), ENTITY_NAME);
        	series.setLogoUrl(cdnUrl);
        } else if (series.getLogoUrl() == null) {
        	cdnService.deleteImage(series.getId().toString(), ENTITY_NAME);
        }
        Series result = seriesRepository.save(series);
        seriesSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, series.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /series/:id} : Partial updates given fields of an existing series, field will ignore if it is null
     *
     * @param id the id of the series to save.
     * @param series the series to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated series,
     * or with status {@code 400 (Bad Request)} if the series is not valid,
     * or with status {@code 404 (Not Found)} if the series is not found,
     * or with status {@code 500 (Internal Server Error)} if the series couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/series/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Series> partialUpdateSeries(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Series series
    ) throws URISyntaxException {
        log.debug("REST request to partial update Series partially : {}, {}", id, series);
        if (series.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, series.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seriesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Series> result = seriesRepository
            .findById(series.getId())
            .map(existingSeries -> {
                if (series.getName() != null) {
                    existingSeries.setName(series.getName());
                }
                if (series.getShortname() != null) {
                    existingSeries.setShortname(series.getShortname());
                }
                if (series.getOrganizer() != null) {
                    existingSeries.setOrganizer(series.getOrganizer());
                }
                if (series.getLogo() != null) {
                    existingSeries.setLogo(series.getLogo());
                }

                return existingSeries;
            })
            .map(seriesRepository::save)
            .map(savedSeries -> {
                seriesSearchRepository.save(savedSeries);

                return savedSeries;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, series.getId().toString())
        );
    }

    /**
     * {@code GET  /series} : get series.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of series in body.
     */
    @GetMapping("/series")
    public ResponseEntity<List<Series>> getSeries(@RequestParam(required = false) String query, Pageable pageable) {
        log.debug("REST request to search for a page of Series for query {}", query);
        Page<Series> page;
        if (StringUtils.isBlank(query)) {
            page = seriesRepository.findAll(pageable);
        } else {
            page = searchService.performWildcardSearch(
                Series.class,
                query,
                Arrays.asList("name", "shortname", "organizer"),
                pageable
            );
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/series/{id}/editions")
    public ResponseEntity<List<SeriesEdition>> getAllEditions(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get a page of Series");
        Page<SeriesEdition> page = seriesEditionRepository.findBySeriesId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET  /series/:id} : get the "id" series.
     *
     * @param id the id of the series to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the series, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/series/{id}")
    public ResponseEntity<Series> getSeries(@PathVariable Long id) {
        log.debug("REST request to get Series : {}", id);
        Optional<Series> series = seriesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(series);
    }

    /**
     * {@code DELETE  /series/:id} : delete the "id" series.
     *
     * @param id the id of the series to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/series/{id}")
    @Secured({AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        log.debug("REST request to delete Series : {}", id);
        seriesRepository.deleteById(id);
        seriesSearchRepository.deleteById(id);
        cdnService.deleteImage(id.toString(), ENTITY_NAME);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/series?query=:query} : search for the series corresponding
     * to the query.
     *
     * @param query the query of the series search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/series")
    public ResponseEntity<List<Series>> searchSeries(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Series for query {}", query);
        Page<Series> page = searchService.performWildcardSearch(
          Series.class,
          query,
          Arrays.asList("name"),
          pageable
        );
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_search/{id}/editions")
    public ResponseEntity<List<SeriesEdition>> searchSeriesEditions(@PathVariable Long id, @RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SeriesEditions for query {}", query);
        //TODO: Implement proper search
        Page<SeriesEdition> page = seriesEditionRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/series/{id}/editionIds")
    public ResponseEntity<List<EditionIdYearDTO>> findEventEditionsIds(@PathVariable Long id) {
        return new ResponseEntity<>(
            seriesEditionRepository.findSeriesEditionsIdYear(id)
                .stream()
                .map(e -> new EditionIdYearDTO((Long)e[0], (String)e[1]))
                .collect(Collectors.<EditionIdYearDTO> toList()),
            HttpStatus.OK);
    }
}

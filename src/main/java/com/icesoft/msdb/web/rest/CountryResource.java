package com.icesoft.msdb.web.rest;

import java.util.List;
import java.util.Optional;

import tech.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.icesoft.msdb.domain.Country;
import com.icesoft.msdb.repository.CountryRepository;

/**
 * REST controller for managing Engine.
 */
@RestController
@RequestMapping("/api")
public class CountryResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Logger log = LoggerFactory.getLogger(CountryResource.class);

    private final CountryRepository countryRepository;

    public CountryResource(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @GetMapping("/_typeahead/countries")
    @Timed
    public List<Country> typeahead(@RequestParam String query) {
        log.debug("REST request to search for countries for query {}", query);
        List<Country> results = countryRepository.findByCountryNameContaining(query);
        return results;
    }

    @GetMapping("/countries/{countryCode}")
    @Timed
    public ResponseEntity<Country> getCountry(@PathVariable String countryCode) {
        log.debug("REST request to get a country by its ID {}", countryCode);
        Optional<Country> country = countryRepository.findByCountryCode(countryCode);
        return ResponseUtil.wrapOrNotFound(country);
    }
}

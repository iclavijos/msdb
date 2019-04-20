package com.icesoft.msdb.web.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.Country;
import com.icesoft.msdb.repository.CountryRepository;

/**
 * REST controller for managing Engine.
 */
@RestController
@RequestMapping("/api")
public class CountryResource {

    private final Logger log = LoggerFactory.getLogger(CountryResource.class);

    private final CountryRepository countryRepository;

    public CountryResource(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @GetMapping("/_typeahead/countries")
    public List<Country> typeahead(@RequestParam String query) {
        log.debug("REST request to search for countries for query {}", query);
        List<Country> results = countryRepository.findByCountryNameContaining(query);
        return results;
    }
}

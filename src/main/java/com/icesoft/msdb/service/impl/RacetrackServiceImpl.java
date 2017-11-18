package com.icesoft.msdb.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.IOException;
import java.util.List;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.TimeZoneApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.search.RacetrackLayoutSearchRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.service.RacetrackService;

/**
 * Service Implementation for managing Racetrack.
 */
@Service
@Transactional
public class RacetrackServiceImpl implements RacetrackService{

    private final Logger log = LoggerFactory.getLogger(RacetrackServiceImpl.class);
    
    private final RacetrackRepository racetrackRepository;
    private final RacetrackSearchRepository racetrackSearchRepo;
    
    private final RacetrackLayoutRepository racetrackLayoutRepository;
    private final RacetrackLayoutSearchRepository racetrackLayoutSearchRepo;


    public RacetrackServiceImpl(RacetrackRepository racetrackRepository, 
    		RacetrackSearchRepository racetrackSearchRepo,
    		RacetrackLayoutRepository racetrackLayoutRepository,
    		RacetrackLayoutSearchRepository racetrackLayoutSearchRepo) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackSearchRepo = racetrackSearchRepo;
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.racetrackLayoutSearchRepo = racetrackLayoutSearchRepo;
    }

    /**
     * Save a racetrack.
     *
     * @param racetrack the entity to save
     * @return the persisted entity
     */
    @Override
    public Racetrack save(Racetrack racetrack) {
        log.debug("Request to save Racetrack : {}", racetrack);
        
        GeoApiContext context = new GeoApiContext().setApiKey("AIzaSyBrTxr6pxxOtRuZHTZ_AGt0xTPUp8u-3y0");
        GeocodingResult[] results;
		try {
			results = GeocodingApi.geocode(context, racetrack.getLocation() + ", " + racetrack.getCountryCode()).await();
			if (results == null || results.length == 0) {
				throw new MSDBException("No geolocation could be found for the provided information");
			}
			TimeZone timeZone = TimeZoneApi.getTimeZone(context, results[0].geometry.location).await();
			racetrack.setTimeZone(timeZone.getID());
			Racetrack result = racetrackRepository.save(racetrack);
			racetrackSearchRepo.save(result);
			return result;
		} catch (ApiException | InterruptedException | IOException e) {
			log.error("Error accessing Google Geolocation API", e);
			throw new MSDBException("Problems trying to retrieve geolocation information");
		}
    }
    
    @Override
    public RacetrackLayout save(RacetrackLayout layout) {
        log.debug("Request to save RacetrackLayout : {}", layout);
        
        RacetrackLayout result = racetrackLayoutRepository.save(layout);
        racetrackLayoutSearchRepo.save(result);
        return result;
    }

    /**
     *  Get all the racetracks.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Racetrack> findAll(Pageable pageable) {
        log.debug("Request to get all Racetracks");
        Page<Racetrack> result = racetrackRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get one racetrack by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Racetrack findOne(Long id) {
        log.debug("Request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findOne(id);
        return racetrack;
    }
    
    @Override
    @Transactional(readOnly = true)
    public RacetrackLayout findLayout(Long id) {
        log.debug("Request to get RacetrackLayout : {}", id);
        RacetrackLayout layout = racetrackLayoutRepository.findOne(id);
        return layout;
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findOne(id);
        racetrackLayoutSearchRepo.delete(racetrack.getLayouts());
        racetrackLayoutRepository.deleteInBatch(racetrack.getLayouts());
        racetrackRepository.delete(id);
        racetrackSearchRepo.delete(id);
    }
    
    @Override
    public void deleteLayout(Long id) {
        log.debug("Request to delete RacetrackLayout : {}", id);
        racetrackLayoutRepository.delete(id);
        racetrackLayoutSearchRepo.delete(id);
    }
    
    @Override
    public Page<Racetrack> search(String query, Pageable pageable) {
    	String searchValue = "*" + query + '*';
    	return racetrackSearchRepo.search(queryStringQuery(searchValue), pageable);
    }
    
    @Override
    public List<RacetrackLayout> findRacetrackLayouts(Long id) {
    	return racetrackLayoutRepository.findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(id);
    }
}

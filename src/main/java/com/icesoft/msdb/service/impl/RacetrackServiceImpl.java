package com.icesoft.msdb.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.io.IOException;
import java.util.List;
import java.util.TimeZone;

import org.elasticsearch.search.sort.SortBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
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
import com.icesoft.msdb.service.CDNService;
import com.icesoft.msdb.service.RacetrackService;

/**
 * Service Implementation for managing Racetrack.
 */
@Service
@Transactional
public class RacetrackServiceImpl implements RacetrackService {

    private final Logger log = LoggerFactory.getLogger(RacetrackServiceImpl.class);
    
    private final RacetrackRepository racetrackRepository;
    private final RacetrackSearchRepository racetrackSearchRepo;
    
    private final RacetrackLayoutRepository racetrackLayoutRepository;
    private final RacetrackLayoutSearchRepository racetrackLayoutSearchRepo;
    
    private final CDNService cdnService;


    public RacetrackServiceImpl(RacetrackRepository racetrackRepository, 
    		RacetrackSearchRepository racetrackSearchRepo,
    		RacetrackLayoutRepository racetrackLayoutRepository,
    		RacetrackLayoutSearchRepository racetrackLayoutSearchRepo,
    		CDNService cdnService) {
        this.racetrackRepository = racetrackRepository;
        this.racetrackSearchRepo = racetrackSearchRepo;
        this.racetrackLayoutRepository = racetrackLayoutRepository;
        this.racetrackLayoutSearchRepo = racetrackLayoutSearchRepo;
        this.cdnService = cdnService;
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
			
			if (racetrack.getLogo() != null) {
				byte[] logo = racetrack.getLogo();
				racetrack = racetrackRepository.save(racetrack);
		        String cdnUrl = cdnService.uploadImage(racetrack.getId().toString(), logo, "racetrack");
		        racetrack.setLogoUrl(cdnUrl);
				
		        racetrack = racetrackRepository.save(racetrack);
	        } else if (racetrack.getLogoUrl() == null) {
	        	if (racetrack.getId() != null) {
	        		cdnService.deleteImage(racetrack.getId().toString(), "racetrack");
	        	}
	        }
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
        
        
        if (layout.getLayoutImage() != null) {
        	byte[] layoutImg = layout.getLayoutImage();
        	layout = racetrackLayoutRepository.save(layout);
	        String cdnUrl = cdnService.uploadImage(layout.getId().toString(), layoutImg, "racetrackLayout");
	        layout.setLayoutImageUrl(cdnUrl);
			
	        layout = racetrackLayoutRepository.save(layout);
        } else if (layout.getLayoutImageUrl() == null) {
        	if (layout.getId() != null) {
        		cdnService.deleteImage(layout.getId().toString(), "racetrackLayout");
        	}
        }
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
    public Racetrack find(Long id) {
        log.debug("Request to get Racetrack : {}", id);
        Racetrack racetrack = racetrackRepository.findById(id).get();
        return racetrack;
    }
    
    @Override
    @Transactional(readOnly = true)
    public RacetrackLayout findLayout(Long id) {
        log.debug("Request to get RacetrackLayout : {}", id);
        RacetrackLayout layout = racetrackLayoutRepository.findById(id).get();
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
        Racetrack racetrack = racetrackRepository.findById(id).get();
        racetrackLayoutSearchRepo.deleteAll(racetrack.getLayouts());
        racetrackLayoutRepository.deleteInBatch(racetrack.getLayouts());
        racetrackRepository.deleteById(id);
        racetrackSearchRepo.deleteById(id);
        cdnService.deleteImage(id.toString(), "racetrack");
    }
    
    @Override
    public void deleteLayout(Long id) {
        log.debug("Request to delete RacetrackLayout : {}", id);
        racetrackLayoutRepository.deleteById(id);
        racetrackLayoutSearchRepo.deleteById(id);
    }
    
    @Override
    public Page<Racetrack> search(String query, Pageable pageable) {
    	String searchValue = "*" + query + '*';
    	NativeSearchQueryBuilder nqb = new NativeSearchQueryBuilder()
        		.withQuery(queryStringQuery(searchValue))
        		.withSort(SortBuilders.fieldSort("name"))
        		.withPageable(pageable);
        
    	return racetrackSearchRepo.search(nqb.build());
    }
    
    @Override
    public Page<RacetrackLayout> searchLayouts(String query, Pageable pageable) {
    	String searchValue = "*" + query + '*';
    	NativeSearchQueryBuilder nqb = new NativeSearchQueryBuilder()
        		.withQuery(queryStringQuery(searchValue))
        		.withSort(SortBuilders.fieldSort("name"))
        		.withPageable(pageable);
        
    	return racetrackLayoutSearchRepo.search(nqb.build());
    }
    
    @Override
    public List<RacetrackLayout> findRacetrackLayouts(Long id) {
    	return racetrackLayoutRepository.findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(id);
    }
}

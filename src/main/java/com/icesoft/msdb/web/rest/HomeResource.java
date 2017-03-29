package com.icesoft.msdb.web.rest;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamRepository;

@RestController
@RequestMapping("/api")
public class HomeResource {
	
	private final Logger log = LoggerFactory.getLogger(HomeResource.class);
	
	private final DriverRepository driversRepository;
	private final RacetrackRepository racetrackRepository;
	private final SeriesEditionRepository seriesEditionRepository;
	private final TeamRepository teamRepository;
	private final EventEditionRepository eventsEditionsRepository;

	public HomeResource(DriverRepository driverRepo, RacetrackRepository racetrackRepo, 
			SeriesEditionRepository seriesRepo, TeamRepository teamRepo, EventEditionRepository eventsRepo) {
		this.driversRepository = driverRepo;
		this.racetrackRepository = racetrackRepo;
		this.seriesEditionRepository = seriesRepo;
		this.teamRepository = teamRepo;
		this.eventsEditionsRepository = eventsRepo;
	}
	
	@GetMapping("/home")
    @Timed
    @Cacheable(cacheNames="homeInfo")
    public Object getHomeInfo() {
        log.debug("REST request to get home information");
        
        long drivers = driversRepository.count();
        long racetracks = racetrackRepository.count();
        long series = seriesEditionRepository.count();
        long teams = teamRepository.count();
        long events = eventsEditionsRepository.count();
        
        JSONObject mainObj = new JSONObject();
        try {
        	mainObj.put("drivers", drivers);
        	mainObj.put("racetracks", racetracks);
        	mainObj.put("series", series);
        	mainObj.put("teams", teams);
        	mainObj.put("events", events);
        } catch (JSONException ex) {
        	log.error("Exception processing response data", ex);
        }
        return mainObj.toString();
    }
}

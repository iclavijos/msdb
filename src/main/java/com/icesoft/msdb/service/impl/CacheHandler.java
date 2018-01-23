package com.icesoft.msdb.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class CacheHandler {
	private final Logger log = LoggerFactory.getLogger(CacheHandler.class);

	@CacheEvict(cacheNames={"driversStandingsCache","teamsStandingsCache"})
	public void resetDriversStandingsCache(Long seriesEditionId) {
		log.debug("Reseting drivers standings cache for series edition {}", seriesEditionId);
	}
	
	@CacheEvict(cacheNames="winnersCache")
	public void resetWinnersCache(Long eventEditionId) {
		log.debug("Reseting winners cache for event edition {}", eventEditionId);
	}
	
	@CacheEvict(cacheNames="driversChampions")
	public void resetSeriesChampions(Long seriesEditionId) {
		log.debug("Reseting series champions cache for series edition {}", seriesEditionId);
	}
	
	@CacheEvict(cacheNames="pointRaceByRace")
	public void resetPointsRaceByRace(Long seriesEditionId) {
		log.debug("Reseting race by race points cache for series edition {}", seriesEditionId);
	}
	
}

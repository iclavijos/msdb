package com.icesoft.msdb.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class CacheHandler {
	private final Logger log = LoggerFactory.getLogger(CacheHandler.class);

	@CacheEvict(cacheNames={"driversStandingsCache","teamsStandingsCache", "manufacturersStandingsCache"})
	public void resetDriversStandingsCache(Long seriesEditionId) {
		log.debug("Reseting drivers standings cache for series edition {}", seriesEditionId);
	}
	
	@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, key="#seriesEditionId")
	public void resetWinnersCache(Long seriesEditionId) {
		log.debug("Reseting winners cache for series edition {}", seriesEditionId);
	}
	
	@CacheEvict(cacheNames="driversChampions")
	public void resetSeriesChampions(Long seriesEditionId) {
		log.debug("Reseting series champions cache for series edition {}", seriesEditionId);
	}
	
	@CacheEvict(cacheNames= {"pointRaceByRace", "resultsRaceByRace"})
	public void resetPointsRaceByRace(Long seriesEditionId) {
		log.debug("Reseting race by race points cache for series edition {}", seriesEditionId);
	}
	
}

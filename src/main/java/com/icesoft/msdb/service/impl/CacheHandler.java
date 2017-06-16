package com.icesoft.msdb.service.impl;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class CacheHandler {

	@CacheEvict(key="#seriesEditionId", cacheNames={"driversStandingsCache","teamsStandingsCache"})
	public void resetDriversStandingsCache(Long seriesEditionId) {
	}
	
	@CacheEvict(key="#eventEditionId", cacheNames="winnersCache")
	public void resetWinnersCache(Long eventEditionId) {
	}
}

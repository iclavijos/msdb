package com.icesoft.msdb.service.impl;

import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class CacheHandler {
	private final Logger log = LoggerFactory.getLogger(CacheHandler.class);

	@Autowired private CacheManager cacheManager;
	@Autowired private SeriesEditionRepository seriesEditionRepo;

	public void resetSeriesEditionCaches(SeriesEdition seriesEdition) {
        seriesEdition.getAllowedCategories().forEach(cat -> {
            List<Object> keys = new ArrayList<>();
            keys.add(seriesEdition.getId());
            keys.add(cat.getShortname());
            cacheManager.getCache("winnersCache").evict(seriesEdition.getId());
            cacheManager.getCache("pointRaceByRace").evict(keys);
            cacheManager.getCache("resultsRaceByRace").evict(keys);
            cacheManager.getCache("driversStandingsCache").evict(seriesEdition.getId());
            cacheManager.getCache("teamsStandingsCache").evict(seriesEdition.getId());
        });
    }

	//@CacheEvict(cacheNames={"driversStandingsCache","teamsStandingsCache", "manufacturersStandingsCache"})
	public void resetDriversStandingsCache(Long seriesEditionId) {
		log.debug("Reseting drivers standings cache for series edition {}", seriesEditionId);
        resetSeriesEditionCaches(seriesEditionRepo.findOne(seriesEditionId));
	}

	//@CacheEvict(cacheNames={"winnersCache", "pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
	public void resetWinnersCache(Long seriesEditionId) {
		log.debug("Reseting winners cache for series edition {}", seriesEditionId);
        resetSeriesEditionCaches(seriesEditionRepo.findOne(seriesEditionId));
	}

	@CacheEvict(cacheNames="driversChampions")
	public void resetSeriesChampions(Long seriesEditionId) {
		log.debug("Reseting series champions cache for series edition {}", seriesEditionId);
	}

	@CacheEvict(cacheNames={"pointRaceByRace", "resultsRaceByRace"}, allEntries = true)
	public void resetPointsRaceByRace(Long seriesEditionId) {
		log.debug("Reseting race by race points cache for series edition {}", seriesEditionId);
	}

    @CacheEvict(cacheNames= {"lapsDriversCache", "lapsAveragesCache", "positionsCache"})
	public void resetLapByLapCaches(Long sessionId) {
        log.debug("Reseting lap by lap data caches for session id {}", sessionId);
    }

}

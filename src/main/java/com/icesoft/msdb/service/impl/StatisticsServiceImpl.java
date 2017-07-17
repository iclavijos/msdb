package com.icesoft.msdb.service.impl;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.repository.DriverStatisticsRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.service.StatisticsService;

@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {
	
	private final Logger log = LoggerFactory.getLogger(StatisticsServiceImpl.class);
	
	private final EventEditionRepository eventEditionRepo;
	private final EventEntryRepository entriesRepo;
	private final EventEntryResultRepository resultsRepo;
	private final DriverStatisticsRepository driverStatsRepo;

	public StatisticsServiceImpl(
			EventEditionRepository eventEditionRepo,
			EventEntryRepository entriesRepo,
			EventEntryResultRepository resultsRepo, 
			DriverStatisticsRepository driverStatsRepo) {
		this.eventEditionRepo = eventEditionRepo;
		this.entriesRepo = entriesRepo;
		this.resultsRepo = resultsRepo;
		this.driverStatsRepo = driverStatsRepo;
	}
	
	private void deleteStatistics() {
		driverStatsRepo.deleteAll();
	}
	
	@Override
	public void rebuildStatistics() {
		log.info("Rebuilding all statistics...");
		deleteStatistics();
		
		eventEditionRepo.findAll().stream().forEach((event) -> {
			log.debug("Processing statistics for event {}", event.getLongEventName());
			
			entriesRepo.findEventEditionEntries(event.getId()).parallelStream().forEach((entry) -> {
				List<EventEntryResult> results = resultsRepo.findByEntryId(entry.getId());
				entry.getDrivers().parallelStream().forEach((driver) -> updateDriverStatistics(entry, results, driver));
			});
			
			log.debug("Statistics for event {} rebuilt", event.getLongEventName());
		});
		
		log.info("Statistics rebuilt...");
	}

	private void updateDriverStatistics(EventEditionEntry entry, List<EventEntryResult> results, Driver driver) {
		DriverStatistics dStats = driverStatsRepo.findOne(driver.getId().toString());
		if (dStats == null) {
			dStats = new DriverStatistics(driver.getId().toString());
		}
		Statistics stats = dStats.getStaticsForCategory(entry.getCategory().getName());
		results.stream().forEach((result) -> {
			log.debug("Processing stats for driver {} in race {}", driver.getFullName(), result.getSession().getName());
			if (result.getLapsCompleted() != null) {
				stats.addLaps(result.getLapsCompleted(), result.getEntry().getEventEdition().getTrackLayout().getLength());
			}
			if (result.getSession().getSessionType().equals(SessionType.RACE)) {
				stats.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				if (result.getStartingPosition() != null) {
					stats.addFinishPositionQ(result.getStartingPosition());
				}
			}
		});
		stats.incParticipations();
		dStats.updateStatistics(entry.getCategory().getName(), stats);
		
		driverStatsRepo.save(dStats);
	}

	@Override
	public void buildEventStatistics(Long eventEditionId) {
		if (eventEditionId == null) {
			throw new MSDBException("Invalid event edition");
		}
		buildEventStatistics(eventEditionRepo.findOne(eventEditionId));
		
	}

	@Override
	public void buildEventStatistics(EventEdition eventEdition) {
		if (eventEdition == null) {
			throw new MSDBException("Invalid event edition");
		}
		
	}

	@Override
	public Map<String, Statistics> getDriverStatistics(Long driverId) {
		return driverStatsRepo.findOne(driverId.toString()).getDriverStatistics();
	}

}

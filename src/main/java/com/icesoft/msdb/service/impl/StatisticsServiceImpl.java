package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.ElementStatistics;
import com.icesoft.msdb.domain.stats.EngineStatistics;
import com.icesoft.msdb.domain.stats.Result;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.stats.ChassisStatisticsRepository;
import com.icesoft.msdb.repository.stats.DriverStatisticsRepository;
import com.icesoft.msdb.repository.stats.EngineStatisticsRepository;
import com.icesoft.msdb.repository.stats.RacetrackLayoutStatisticsRepository;
import com.icesoft.msdb.repository.stats.TeamStatisticsRepository;
import com.icesoft.msdb.repository.stats.TyreProviderStatisticsRepository;
import com.icesoft.msdb.service.StatisticsService;

@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {
	
	private final Logger log = LoggerFactory.getLogger(StatisticsServiceImpl.class);
	
	private final EventEditionRepository eventEditionRepo;
	private final EventEntryRepository entriesRepo;
	private final EventEntryResultRepository resultsRepo;
	private final DriverStatisticsRepository driverStatsRepo;
	private final TeamStatisticsRepository teamStatsRepo;
	private final ChassisStatisticsRepository chassisStatsRepo;
	private final EngineStatisticsRepository engineStatsRepo;
	private final TyreProviderStatisticsRepository tyreProvStatsRepo;
	private final RacetrackLayoutStatisticsRepository racetrackLayoutStatsRepo;

	public StatisticsServiceImpl(
			EventEditionRepository eventEditionRepo,
			EventEntryRepository entriesRepo,
			EventEntryResultRepository resultsRepo, 
			DriverStatisticsRepository driverStatsRepo,
			TeamStatisticsRepository teamStatsRepo,
			ChassisStatisticsRepository chassisStatsRepo,
			EngineStatisticsRepository engineStatsRepo,
			TyreProviderStatisticsRepository tyreProvStatsRepo,
			RacetrackLayoutStatisticsRepository racetrackLayoutStatsRepo) {
		this.eventEditionRepo = eventEditionRepo;
		this.entriesRepo = entriesRepo;
		this.resultsRepo = resultsRepo;
		this.driverStatsRepo = driverStatsRepo;
		this.teamStatsRepo = teamStatsRepo;
		this.chassisStatsRepo = chassisStatsRepo;
		this.engineStatsRepo = engineStatsRepo;
		this.tyreProvStatsRepo = tyreProvStatsRepo;
		this.racetrackLayoutStatsRepo = racetrackLayoutStatsRepo;
	}
	
	@Override
	public void deleteStatistics() {
		driverStatsRepo.deleteAll();
		teamStatsRepo.deleteAll();
		chassisStatsRepo.deleteAll();
		engineStatsRepo.deleteAll();
		tyreProvStatsRepo.deleteAll();
		racetrackLayoutStatsRepo.deleteAll();
	}
	
//	@Override
//	public void rebuildStatistics() {
//		log.info("Rebuilding all statistics...");
//		deleteStatistics();
//		
//		eventEditionRepo.findAll().parallelStream()
//			.sorted((e1, e2) -> e1.getEventDate().compareTo(e2.getEventDate()))
//			.forEach(this::buildEventStatistics);
//		
//		log.info("Statistics rebuilt...");
//	}
	
	@Override
	public void buildEventStatistics(Long eventEditionId) {
		if (eventEditionId == null) {
			throw new MSDBException("Invalid event edition");
		}
		buildEventStatistics(eventEditionRepo.findOne(eventEditionId));
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void updateStats(String categoryName, Integer year, Result result, 
			MongoRepository mongoRepo, ElementStatistics eStats) {
		Statistics statsTeam = eStats.getStaticsForCategory(categoryName);
		Statistics statsTeamYear = eStats.getStaticsForCategory(categoryName, year);
		statsTeam.addResult(result);
		statsTeamYear.addResult(result);
		
		eStats.updateStatistics(categoryName, statsTeam);
		eStats.updateStatistics(categoryName, statsTeamYear, year);
		
		mongoRepo.save(eStats);
	}

	@Override
	public void buildEventStatistics(EventEdition event) {
		if (event == null) {
			throw new MSDBException("Invalid event edition");
		}
		log.debug("Processing statistics for event {}", event.getLongEventName());
		
		removeStatisticsIfExist(event);
		
		List<Result> results = entriesRepo.findEventEditionEntries(event.getId()).parallelStream()
				.map(this::processEntry).flatMap(l -> l.stream())
				.collect(Collectors.toList());
		Map<Long, Boolean> entryProcessed = new HashMap<>();
		results.stream().forEach(result -> {
			EventEditionEntry entry = result.getEntryResult().getEntry();
			String categoryName = entry.getCategory().getName();
			Integer year = entry.getEventEdition().getEditionYear();
			
			if (!entryProcessed.containsKey(result.getEntryId())) { //To avoid duplicate statistics for multidriver events
				entry.getDrivers().stream().forEach(driver -> {
					DriverStatistics dStats = Optional.ofNullable(driverStatsRepo.findOne(driver.getId().toString()))
							.orElse(new DriverStatistics(driver.getId().toString()));
					updateStats(categoryName, year, result, driverStatsRepo, dStats);
				});
				
				TeamStatistics tStats = Optional.ofNullable(teamStatsRepo.findOne(entry.getTeam().getId().toString()))
						.orElse(new TeamStatistics(entry.getTeam().getId().toString()));
				updateStats(categoryName, year, result, teamStatsRepo, tStats);
				
				ChassisStatistics cStats = Optional.ofNullable(chassisStatsRepo.findOne(entry.getChassis().getId().toString()))
						.orElse(new ChassisStatistics(entry.getChassis().getId().toString()));
				updateStats(categoryName, year, result, chassisStatsRepo, cStats);
				
				EngineStatistics eStats = Optional.ofNullable(engineStatsRepo.findOne(entry.getEngine().getId().toString()))
						.orElse(new EngineStatistics(entry.getEngine().getId().toString()));
				updateStats(categoryName, year, result, engineStatsRepo, eStats);
				
				entryProcessed.put(result.getEntryId(), true);
			}
		});
		
		log.debug("Statistics for event {} rebuilt", event.getLongEventName());
	}
	
	private List<Result> processEntry(EventEditionEntry entry) {
		List<EventEntryResult> results = resultsRepo.findByEntryIdAndSessionSessionType(entry.getId(), SessionType.RACE);
		return entry.getDrivers().parallelStream()
				.flatMap(driver -> createResultObject(entry, results).stream())
				.collect(Collectors.toList());
	}
	
	private void removeStatisticsIfExist(EventEdition event) {
		//TODO
//		entriesRepo.findEventEditionEntries(event.getId()).parallelStream().forEach((entry) -> {
//			entry.getDrivers().parallelStream().forEach((driver) -> {
//				DriverStatistics ds = driverStatsRepo.findOne(driver.getId().toString());
//				ds.removeStatisticsOfEvent(event.getId());
//			});
//		});
	}
	
	private List<Result> createResultObject(EventEditionEntry entry, List<EventEntryResult> results) {
		return results.parallelStream().map((result) -> {			
			List<EventEntryResult> resultsCategory = resultsRepo.findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAscLapsCompletedDesc(
					entry.getEventEdition().getId(), result.getSession().getId(), entry.getCategory().getId());
			
			int posInClass = -1;
			int startPosInClass = -1;			
			if (entry.getEventEdition().getAllowedCategories().size() == 1) {
				posInClass = result.getFinalPosition().intValue();
				startPosInClass = result.getStartingPosition() != null ? result.getStartingPosition().intValue() : -1;
			} else {
				posInClass = resultsCategory.indexOf(result) + 1;
				if (result.getStartingPosition() != null) {
					startPosInClass = resultsCategory.parallelStream()
						.sorted((r1, r2) -> r1.getStartingPosition().compareTo(r2.getStartingPosition()))
						.collect(Collectors.toList()).indexOf(result) + 1;
				}
			}
			
			//Fast lap
			int posFL = -1;
			if (result.getBestLapTime() != null) {
				posFL = resultsCategory.parallelStream()
					.sorted((r1, r2) -> 
						Optional.ofNullable(r1.getBestLapTime()).orElse(Long.MAX_VALUE)
							.compareTo(Optional.ofNullable(r2.getBestLapTime()).orElse(Long.MAX_VALUE)))
					.collect(Collectors.toList()).indexOf(result) + 1;
			}
			
			//Grand Chelem
			boolean grandChelem = false;
			if (posFL == 1 && posInClass == 1 && 
					result.getLapsCompleted() != null && result.getLapsCompleted().equals(result.getLapsLed())) {
				grandChelem = true;
			}
			List<EventEntryResult> qualyLaps = resultsRepo.findEntryFastestLapPerSessionType(result.getEntry().getId(), SessionType.QUALIFYING);
			Long poleLapTime = 0L;
			if (!qualyLaps.isEmpty()) {
				poleLapTime = qualyLaps.get(0).getBestLapTime();
			}
			return new Result(result, grandChelem, posInClass, startPosInClass, poleLapTime, posFL > -1);
		}).collect(Collectors.toList());
	}

	@Override
	public Map<String, Statistics> getDriverStatistics(Long driverId) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		return driverStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}
	
	@Override
	public Map<String, Statistics> getDriverStatistics(Long driverId, Integer year) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		return driverStats.map(ds -> ds.getStatisticsYear(year)).orElseGet(HashMap<String, Statistics> :: new);
	}
	
	@Override
	public List<Integer> getDriverYearsStatistics(Long driverId) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		List<Integer> result = driverStats.map(ds -> ds.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		result.sort(reversed);
		return result;
	}

	@Override
	public Map<String, Statistics> getTeamStatistics(Long teamId) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(teamId.toString()));
		return teamStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getTeamStatistics(Long teamId, Integer year) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(teamId.toString()));
		return teamStats.map(ts -> ts.getStatisticsYear(year)).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public List<Integer> getTeamYearsStatistics(Long driverId) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(driverId.toString()));
		List<Integer> result = teamStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		result.sort(reversed);
		return result;
	}

	@Override
	public Map<String, Statistics> getChassisStatistics(Long chassisId) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		return chassisStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getChassisStatistics(Long chassisId, Integer year) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		return chassisStats.map(cs -> cs.getStatisticsYear(year)).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public List<Integer> getChassisYearsStatistics(Long chassisId) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		List<Integer> result = chassisStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		result.sort(reversed);
		return result;
	}

	@Override
	public Map<String, Statistics> getEngineStatistics(Long engineId) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		return engineStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getEngineStatistics(Long engineId, Integer year) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		return engineStats.map(cs -> cs.getStatisticsYear(year)).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public List<Integer> getEngineYearsStatistics(Long engineId) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		List<Integer> result = engineStats.map(es -> es.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		result.sort(reversed);
		return result;
	}

}

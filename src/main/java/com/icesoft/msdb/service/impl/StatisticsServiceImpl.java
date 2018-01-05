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
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.ElementStatistics;
import com.icesoft.msdb.domain.stats.EngineStatistics;
import com.icesoft.msdb.domain.stats.Result;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
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
	private final DriverEventPointsRepository driverPointsRepo;
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
			SeriesEditionRepository seriesEditionRepo,
			DriverEventPointsRepository driverPointsRepo,
			DriverStatisticsRepository driverStatsRepo,
			TeamStatisticsRepository teamStatsRepo,
			ChassisStatisticsRepository chassisStatsRepo,
			EngineStatisticsRepository engineStatsRepo,
			TyreProviderStatisticsRepository tyreProvStatsRepo,
			RacetrackLayoutStatisticsRepository racetrackLayoutStatsRepo) {
		this.eventEditionRepo = eventEditionRepo;
		this.entriesRepo = entriesRepo;
		this.resultsRepo = resultsRepo;
		this.driverPointsRepo = driverPointsRepo;
		this.driverStatsRepo = driverStatsRepo;
		this.teamStatsRepo = teamStatsRepo;
		this.chassisStatsRepo = chassisStatsRepo;
		this.engineStatsRepo = engineStatsRepo;
		this.tyreProvStatsRepo = tyreProvStatsRepo;
		this.racetrackLayoutStatsRepo = racetrackLayoutStatsRepo;
	}
	
	@Override
	public void deleteAllStatistics() {
		driverStatsRepo.deleteAll();
		teamStatsRepo.deleteAll();
		chassisStatsRepo.deleteAll();
		engineStatsRepo.deleteAll();
		tyreProvStatsRepo.deleteAll();
		racetrackLayoutStatsRepo.deleteAll();
	}
	
	@Override
	public void buildEventStatistics(Long eventEditionId) {
		if (eventEditionId == null) {
			throw new MSDBException("Invalid event edition");
		}
		buildEventStatistics(eventEditionRepo.findOne(eventEditionId));
	}
	
	@SuppressWarnings("rawtypes")
	private void updateStats(String categoryName, String year, Result result, 
			MongoRepository mongoRepo, ElementStatistics eStats) {
		updateStats(categoryName, year, result, mongoRepo, eStats, 10);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void updateStats(String categoryName, String year, Result result, 
			MongoRepository mongoRepo, ElementStatistics eStats, int retries) {
		Statistics statsDoc = eStats.getStaticsForCategory(categoryName);
		Statistics statsDocYear = eStats.getStaticsForCategory(categoryName, year);
		statsDoc.addResult(result);
		statsDocYear.addResult(result);
		
		eStats.updateStatistics(categoryName, statsDoc);
		eStats.updateStatistics(categoryName, statsDocYear, year);
		
		if (retries > 0) {
			try {
				mongoRepo.save(eStats);
			} catch (OptimisticLockingFailureException e) {
				updateStats(categoryName, year, result, mongoRepo, eStats, retries - 1);
			}
		} else {
			log.error("Could not update statistics document for entry {} @ event '{}'", 
				result.getEntryResult().getEntry(), result.getEventName());
		}
	}

	@Override
	public void buildEventStatistics(EventEdition event) {
		if (event == null) {
			throw new MSDBException("Invalid event edition");
		}
		log.debug("Processing statistics for event {}", event.getLongEventName());
		
		List<Result> results = entriesRepo.findEventEditionEntries(event.getId()).parallelStream()
				.map(this::processEntry).flatMap(l -> l.stream())
				.collect(Collectors.toList());
		
		results.stream().forEach(result -> {
			EventEditionEntry entry = result.getEntryResult().getEntry();
			String categoryName;
			String year = entry.getEventEdition().getEditionYear().toString();
			if (entry.getEventEdition().getSeriesEdition() != null) {
				categoryName = entry.getEventEdition().getSeriesEdition().getSeries().getName();
			} else {
				categoryName = entry.getEventEdition().getEvent().getName();
			}
			
			entry.getDrivers().stream().forEach(driver -> {
				DriverStatistics dStats = Optional.ofNullable(driverStatsRepo.findOne(driver.getId().toString()))
						.orElse(new DriverStatistics(driver.getId().toString()));
				updateStats(categoryName, year, result, driverStatsRepo, dStats);
			});
			
			if (entry.getTeam() != null) {
				TeamStatistics tStats = Optional.ofNullable(teamStatsRepo.findOne(entry.getTeam().getId().toString()))
						.orElse(new TeamStatistics(entry.getTeam().getId().toString()));
				updateStats(categoryName, year, result, teamStatsRepo, tStats);
			}
			
			ChassisStatistics cStats = Optional.ofNullable(chassisStatsRepo.findOne(entry.getChassis().getId().toString()))
					.orElse(new ChassisStatistics(entry.getChassis().getId().toString()));
			updateStats(categoryName, year, result, chassisStatsRepo, cStats);
			
			if (entry.getEngine() != null) {
				EngineStatistics eStats = Optional.ofNullable(engineStatsRepo.findOne(entry.getEngine().getId().toString()))
						.orElse(new EngineStatistics(entry.getEngine().getId().toString()));
				updateStats(categoryName, year, result, engineStatsRepo, eStats);
			}

			
		});
		
		log.debug("Statistics for event {} rebuilt", event.getLongEventName());
	}
	
	public void buildSeriesStatistics(SeriesEdition series) {
		eventEditionRepo.findBySeriesEditionIdOrderByEventDateAsc(series.getId()).parallelStream().forEach(event -> buildEventStatistics(event));
	}
	
	private List<Result> processEntry(EventEditionEntry entry) {
		List<EventEntryResult> results = resultsRepo.findByEntryIdAndSessionSessionType(entry.getId(), SessionType.RACE);
		Integer lapsCompleted = resultsRepo.countLapsCompletedInEvent(entry.getId());
		return createResultObject(entry, results, lapsCompleted);
	}
	
	@Override
	public void removeEventStatistics(Long eventEditionId) {
		if (eventEditionId == null) {
			throw new MSDBException("Invalid event edition");
		}
		removeEventStatistics(eventEditionRepo.findOne(eventEditionId));
	}
	
	@Override
	public void removeEventStatistics(EventEdition event) {
		String year = event.getEditionYear().toString();
		entriesRepo.findEventEditionEntries(event.getId()).stream().forEach((entry) -> {
			entry.getDrivers().parallelStream().forEach((driver) -> {
				DriverStatistics ds = driverStatsRepo.findOne(driver.getId().toString());
				if (ds != null) {
					ds.removeStatisticsOfEvent(event.getId(), year);
					driverStatsRepo.save(ds);
				}
			});
			
			if (entry.getTeam() != null) {
				TeamStatistics ts = teamStatsRepo.findOne(entry.getTeam().getId().toString());
				if (ts != null) {
					ts.removeStatisticsOfEvent(event.getId(), year);
					teamStatsRepo.save(ts);
				}
			}
			
			ChassisStatistics cs = chassisStatsRepo.findOne(entry.getChassis().getId().toString());
			if (cs != null) {
				cs.removeStatisticsOfEvent(event.getId(), year);
				chassisStatsRepo.save(cs);
			}
			
			if (entry.getEngine() != null) {
				EngineStatistics es = engineStatsRepo.findOne(entry.getEngine().getId().toString());
				if (es != null) {
					es.removeStatisticsOfEvent(event.getId(), year);
					engineStatsRepo.save(es);
				}
			}
		});
	}
	
	private List<Result> createResultObject(EventEditionEntry entry, List<EventEntryResult> results, Integer lapsCompleted) {
		return results.parallelStream().map((result) -> {			
			List<EventEntryResult> resultsCategory = resultsRepo.findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAscLapsCompletedDesc(
					entry.getEventEdition().getId(), result.getSession().getId(), entry.getCategory().getId());
			
			int posInClass = -1;
			int startPosInClass = -1;			
			if (entry.getEventEdition().getAllowedCategories().size() == 1) {
				posInClass = result.getFinalPosition().intValue();
				startPosInClass = result.getStartingPosition() != null ? result.getStartingPosition().intValue() : -1;
				if (startPosInClass == -1 && startPosInClass == 901) {
					//We will look for the minimum finishing position in Q sessions
				}
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

			//Qualy lap
			List<EventEntryResult> qualyLaps = resultsRepo.findEntryFastestLapPerSessionType(result.getEntry().getId(), SessionType.QUALIFYING);
			Long poleLapTime = 0L;
			List<EventEntryResult> qResults = qualyLaps.stream()
					.filter(r -> r.getSession().getSessionType() == SessionType.QUALIFYING).collect(Collectors.toList());
			if (qResults != null && !qResults.isEmpty()) {
				poleLapTime = qResults.get(0).getBestLapTime() != null ? qResults.get(0).getBestLapTime() : 0;
			} else {
				poleLapTime = 0L;
			}
			
			//Grand Chelem
			boolean grandChelem = false;
			if (posFL == 1 && posInClass == 1 && 
					result.getLapsCompleted() != null && result.getLapsCompleted().equals(result.getLapsLed())) {
				grandChelem = true;
			}
			
			//Points
			Float points = Optional.ofNullable(driverPointsRepo.getDriverPointsInSession(
					result.getSession().getId(), 
					entry.getDrivers().get(0).getId())).orElse(new Float(0));

			Result r = new Result(result, grandChelem, posInClass, startPosInClass, poleLapTime, posFL == 1, points);
			if (results.size() == 0 || (results.size() > 0 && results.indexOf(result) == 0)) {
				r.setLapsCompleted(lapsCompleted);
			} else {
				r.setLapsCompleted(0);
			}
			return r;
		}).collect(Collectors.toList());
	}

	@Override
	public Map<String, Statistics> getDriverStatistics(Long driverId) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		return driverStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}
	
	@Override
	public Map<String, Statistics> getDriverStatistics(Long driverId, String year) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		return driverStats.map(ds -> ds.getStatisticsYear(year).orElseGet(HashMap<String, Statistics> :: new)).get();
	}
	
	@Override
	public List<String> getDriverYearsStatistics(Long driverId) {
		Optional<ElementStatistics> driverStats = Optional.ofNullable(driverStatsRepo.findOne(driverId.toString()));
		List<String> result = driverStats.map(ds -> ds.getYearsStatistics()).orElseGet(ArrayList<String>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		return result.parallelStream()
			.map(Integer::parseInt)
			.sorted(reversed)
			.map(y -> y.toString())
			.collect(Collectors.toList());
	}

	@Override
	public Map<String, Statistics> getTeamStatistics(Long teamId) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(teamId.toString()));
		return teamStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getTeamStatistics(Long teamId, String year) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(teamId.toString()));
		return teamStats.map(ts -> ts.getStatisticsYear(year).orElseGet(HashMap<String, Statistics> :: new)).get();
	}

	@Override
	public List<String> getTeamYearsStatistics(Long driverId) {
		Optional<ElementStatistics> teamStats = Optional.ofNullable(teamStatsRepo.findOne(driverId.toString()));
		List<String> result = teamStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<String>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		return result.parallelStream()
				.map(Integer::parseInt)
				.sorted(reversed)
				.map(y -> y.toString())
				.collect(Collectors.toList());
	}

	@Override
	public Map<String, Statistics> getChassisStatistics(Long chassisId) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		return chassisStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getChassisStatistics(Long chassisId, String year) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		return chassisStats.map(cs -> cs.getStatisticsYear(year).orElseGet(HashMap<String, Statistics> :: new)).get();
	}

	@Override
	public List<String> getChassisYearsStatistics(Long chassisId) {
		Optional<ElementStatistics> chassisStats = Optional.ofNullable(chassisStatsRepo.findOne(chassisId.toString()));
		List<String> result = chassisStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<String>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		return result.parallelStream()
				.map(Integer::parseInt)
				.sorted(reversed)
				.map(y -> y.toString())
				.collect(Collectors.toList());
	}

	@Override
	public Map<String, Statistics> getEngineStatistics(Long engineId) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		return engineStats.map(ElementStatistics::getStatistics).orElseGet(HashMap<String, Statistics> :: new);
	}

	@Override
	public Map<String, Statistics> getEngineStatistics(Long engineId, String year) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		return engineStats.map(cs -> cs.getStatisticsYear(year).orElseGet(HashMap<String, Statistics> :: new)).get();
	}

	@Override
	public List<String> getEngineYearsStatistics(Long engineId) {
		Optional<ElementStatistics> engineStats = Optional.ofNullable(engineStatsRepo.findOne(engineId.toString()));
		List<String> result = engineStats.map(es -> es.getYearsStatistics()).orElseGet(ArrayList<String>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed(); 
		return result.parallelStream()
				.map(Integer::parseInt)
				.sorted(reversed)
				.map(y -> y.toString())
				.collect(Collectors.toList());
	}

}

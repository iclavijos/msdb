package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.ElementStatistics;
import com.icesoft.msdb.domain.stats.EngineStatistics;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.domain.stats.TyreProviderStatistics;
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
	
	private void deleteStatistics() {
		driverStatsRepo.deleteAll();
		teamStatsRepo.deleteAll();
		chassisStatsRepo.deleteAll();
		engineStatsRepo.deleteAll();
		tyreProvStatsRepo.deleteAll();
		racetrackLayoutStatsRepo.deleteAll();
	}
	
	@Override
	public void rebuildStatistics() {
		log.info("Rebuilding all statistics...");
		deleteStatistics();
		
		eventEditionRepo.findAll().parallelStream().sorted((e1, e2) -> e1.getEventDate().compareTo(e2.getEventDate())).forEach((event) -> {
			log.debug("Processing statistics for event {}", event.getLongEventName());
			
			entriesRepo.findEventEditionEntries(event.getId()).parallelStream().forEach((entry) -> {
				List<EventEntryResult> results = resultsRepo.findByEntryIdAndSessionSessionType(entry.getId(), SessionType.RACE);
				entry.getDrivers().parallelStream().forEach((driver) -> updateDriverStatistics(entry, results, driver));
				updateOtherStatistics(entry, results);
			});
			
			log.debug("Statistics for event {} rebuilt", event.getLongEventName());
		});
		
		log.info("Statistics rebuilt...");
	}

	private void updateDriverStatistics(EventEditionEntry entry, List<EventEntryResult> results, Driver driver) {
		DriverStatistics dStats = Optional.ofNullable(driverStatsRepo.findOne(driver.getId().toString()))
				.orElse(new DriverStatistics(driver.getId().toString()));

		String categoryName = entry.getCategory().getName();
		Integer year = entry.getEventEdition().getEditionYear();
		Statistics statsDriver = dStats.getStaticsForCategory(categoryName);
		Statistics yearStatsDriver = dStats.getStaticsForCategory(categoryName, year);
		
		results.stream().forEach((result) -> {
			statsDriver.incParticipations();
			yearStatsDriver.incParticipations();
			
			log.debug("Processing stats for driver {} in race {}", driver.getFullName(), result.getSession().getName());
			List<EventEntryResult> resultsCategory = resultsRepo.findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAsc(
					entry.getEventEdition().getId(), result.getSession().getId(), entry.getCategory().getId());
			
			int posInClass = -1;
			int startPosInClass = -1;
			if (result.getLapsCompleted() != null && !result.getEntry().getEventEdition().isMultidriver()) {
				//We do not count laps for multidriver events
				statsDriver.addLaps(result.getLapsCompleted(), result.getEntry().getEventEdition().getTrackLayout().getLength());
				yearStatsDriver.addLaps(result.getLapsCompleted(), result.getEntry().getEventEdition().getTrackLayout().getLength());
			}
			
			if (entry.getEventEdition().getAllowedCategories().size() == 1) {
				posInClass = result.getFinalPosition().intValue();
				startPosInClass = result.getStartingPosition() != null ? result.getStartingPosition().intValue() : -1;
				statsDriver.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				yearStatsDriver.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				if (result.getStartingPosition() != null) {
					statsDriver.addFinishPositionQ(result.getStartingPosition());
					yearStatsDriver.addFinishPositionQ(result.getStartingPosition());
				}
			} else {
				posInClass = resultsCategory.indexOf(result) + 1;
				statsDriver.addFinishPositionR(posInClass, result.isRetired());
				yearStatsDriver.addFinishPositionR(posInClass, result.isRetired());
				if (result.getStartingPosition() != null) {
					startPosInClass = resultsCategory.parallelStream()
						.sorted((r1, r2) -> r1.getStartingPosition().compareTo(r2.getStartingPosition()))
						.collect(Collectors.toList()).indexOf(result);
					statsDriver.addFinishPositionQ(startPosInClass + 1);
					yearStatsDriver.addFinishPositionQ(startPosInClass + 1);
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
				if (posFL == 1) {
					statsDriver.incFastLaps();
					yearStatsDriver.incFastLaps();
				}
			}
			
			//Grand Chelem
			boolean grandChelem = false;
			if (posFL == 1 && posInClass == 1 && 
					result.getLapsCompleted() != null && result.getLapsCompleted().equals(result.getLapsLed())) {
				statsDriver.incGrandChelems();
				yearStatsDriver.incGrandChelems();
				grandChelem = true;
			}
			statsDriver.addResult(result, grandChelem, posInClass, startPosInClass);
			yearStatsDriver.addResult(result, grandChelem, posInClass, startPosInClass);
		});
		
		dStats.updateStatistics(entry.getCategory().getName(), statsDriver);
		dStats.updateStatistics(entry.getCategory().getName(), yearStatsDriver, entry.getEventEdition().getEditionYear());
		
		driverStatsRepo.save(dStats);
	}
	
	private void updateOtherStatistics(EventEditionEntry entry, List<EventEntryResult> results) {
		log.debug("Processing statistics por team {} in event {}", entry.getTeam().getName(), entry.getEventEdition().getLongEventName());
		TeamStatistics tStats = Optional.ofNullable(teamStatsRepo.findOne(entry.getTeam().getId().toString()))
				.orElse(new TeamStatistics(entry.getTeam().getId().toString()));
		ChassisStatistics cStats = Optional.ofNullable(chassisStatsRepo.findOne(entry.getChassis().getId().toString()))
				.orElse(new ChassisStatistics(entry.getChassis().getId().toString()));
		EngineStatistics eStats = Optional.ofNullable(engineStatsRepo.findOne(entry.getEngine().getId().toString()))
				.orElse(new EngineStatistics(entry.getEngine().getId().toString()));
		TyreProviderStatistics tpStats = Optional.ofNullable(tyreProvStatsRepo.findOne(entry.getTyres().getId().toString()))
				.orElse(new TyreProviderStatistics(entry.getTyres().getId().toString()));

		String categoryName = entry.getCategory().getName();
		Integer year = entry.getEventEdition().getEditionYear();
		Statistics statsTeam = tStats.getStaticsForCategory(categoryName);
		Statistics yearStatsTeam = tStats.getStaticsForCategory(categoryName, year);
		Statistics statsChassis = cStats.getStaticsForCategory(categoryName);
		Statistics yearStatsChassis = cStats.getStaticsForCategory(categoryName, year);
		Statistics statsEngine = eStats.getStaticsForCategory(categoryName);
		Statistics yearStatsEngine = eStats.getStaticsForCategory(categoryName, year);
		Statistics statsTyreProv = tpStats.getStaticsForCategory(categoryName);
		Statistics yearStatsTyreProv = tpStats.getStaticsForCategory(categoryName, year);
		
		results.stream().forEach((result) -> {
			statsTeam.incParticipations();
			yearStatsTeam.incParticipations();
			statsChassis.incParticipations();
			yearStatsChassis.incParticipations();
			statsEngine.incParticipations();
			yearStatsEngine.incParticipations();
			statsTyreProv.incParticipations();
			yearStatsTyreProv.incParticipations();
			
			List<EventEntryResult> resultsCategory = resultsRepo.findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAsc(
					entry.getEventEdition().getId(), result.getSession().getId(), entry.getCategory().getId());
			
			int posInClass = -1;
			int startPosInClass = -1;
			if (result.getLapsCompleted() != null) {
				addLaps(statsTeam, yearStatsTeam, statsChassis, yearStatsChassis,
						statsEngine, yearStatsEngine, statsTyreProv, yearStatsTyreProv, 
						result.getLapsCompleted(), result.getEntry().getEventEdition().getTrackLayout().getLength());
			}
			
			if (entry.getEventEdition().getAllowedCategories().size() == 1) {
				statsTeam.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				yearStatsTeam.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				statsChassis.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				yearStatsChassis.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				statsEngine.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				yearStatsEngine.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				statsTyreProv.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				yearStatsTyreProv.addFinishPositionR(result.getFinalPosition(), result.isRetired());
				
				if (result.getStartingPosition() != null) {
					statsTeam.addFinishPositionQ(result.getStartingPosition());
					yearStatsTeam.addFinishPositionQ(result.getStartingPosition());
					statsChassis.addFinishPositionQ(result.getStartingPosition());
					yearStatsChassis.addFinishPositionQ(result.getStartingPosition());
					statsEngine.addFinishPositionQ(result.getStartingPosition());
					yearStatsEngine.addFinishPositionQ(result.getStartingPosition());
					statsTyreProv.addFinishPositionQ(result.getStartingPosition());
					yearStatsTyreProv.addFinishPositionQ(result.getStartingPosition());
				}
			} else {
				posInClass = resultsCategory.indexOf(result) + 1;
				statsTeam.addFinishPositionR(posInClass, result.isRetired());
				yearStatsTeam.addFinishPositionR(posInClass, result.isRetired());
				statsChassis.addFinishPositionR(posInClass, result.isRetired());
				yearStatsChassis.addFinishPositionR(posInClass, result.isRetired());
				statsEngine.addFinishPositionR(posInClass, result.isRetired());
				yearStatsEngine.addFinishPositionR(posInClass, result.isRetired());
				statsTyreProv.addFinishPositionR(posInClass, result.isRetired());
				yearStatsTyreProv.addFinishPositionR(posInClass, result.isRetired());
				
				if (result.getStartingPosition() != null) {
					startPosInClass = resultsCategory.parallelStream()
						.sorted((r1, r2) -> r1.getStartingPosition().compareTo(r2.getStartingPosition()))
						.collect(Collectors.toList()).indexOf(result) + 1;
					statsTeam.addFinishPositionQ(startPosInClass);
					yearStatsTeam.addFinishPositionQ(startPosInClass);
					statsChassis.addFinishPositionQ(startPosInClass);
					yearStatsChassis.addFinishPositionQ(startPosInClass);
					statsEngine.addFinishPositionQ(startPosInClass);
					yearStatsEngine.addFinishPositionQ(startPosInClass);
					statsTyreProv.addFinishPositionQ(startPosInClass);
					yearStatsTyreProv.addFinishPositionQ(startPosInClass);
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
				if (posFL == 1) {
					statsTeam.incFastLaps();
					yearStatsTeam.incFastLaps();
					statsEngine.incFastLaps();
					yearStatsEngine.incFastLaps();
					statsChassis.incFastLaps();
					yearStatsChassis.incFastLaps();
					statsTyreProv.incFastLaps();
					yearStatsTyreProv.incFastLaps();
				}
			}
			
			//Grand Chelem - Ignored for entities other than driver
			boolean grandChelem = false;
			
			statsTeam.addResult(result, grandChelem, posInClass, startPosInClass);
			yearStatsTeam.addResult(result, grandChelem, posInClass, startPosInClass);
			statsChassis.addResult(result, grandChelem, posInClass, startPosInClass);
			yearStatsChassis.addResult(result, grandChelem, posInClass, startPosInClass);
			statsEngine.addResult(result, grandChelem, posInClass, startPosInClass);
			yearStatsEngine.addResult(result, grandChelem, posInClass, startPosInClass);
			statsTyreProv.addResult(result, grandChelem, posInClass, startPosInClass);
			yearStatsTyreProv.addResult(result, grandChelem, posInClass, startPosInClass);
		});
		
		tStats.updateStatistics(entry.getCategory().getName(), statsTeam);
		tStats.updateStatistics(entry.getCategory().getName(), yearStatsTeam, entry.getEventEdition().getEditionYear());
		cStats.updateStatistics(entry.getCategory().getName(), statsChassis);
		cStats.updateStatistics(entry.getCategory().getName(), yearStatsChassis, entry.getEventEdition().getEditionYear());
		eStats.updateStatistics(entry.getCategory().getName(), statsEngine);
		eStats.updateStatistics(entry.getCategory().getName(), yearStatsEngine, entry.getEventEdition().getEditionYear());
		tpStats.updateStatistics(entry.getCategory().getName(), statsTyreProv);
		tpStats.updateStatistics(entry.getCategory().getName(), yearStatsTyreProv, entry.getEventEdition().getEditionYear());
		
		teamStatsRepo.save(tStats);
		chassisStatsRepo.save(cStats);
		engineStatsRepo.save(eStats);
		tyreProvStatsRepo.save(tpStats);
	}

	private void addLaps(Statistics statsTeam,
			Statistics yearStatsTeam, Statistics statsChassis, Statistics yearStatsChassis, Statistics statsEngine,
			Statistics yearStatsEngine, Statistics statsTyreProv, Statistics yearStatsTyreProv,
			Integer lapsCompleted, Integer lapLength) {
		statsTeam.addLaps(lapsCompleted, lapLength);
		yearStatsTeam.addLaps(lapsCompleted, lapLength);
		statsChassis.addLaps(lapsCompleted, lapLength);
		yearStatsChassis.addLaps(lapsCompleted, lapLength);
		statsEngine.addLaps(lapsCompleted, lapLength);
		yearStatsEngine.addLaps(lapsCompleted, lapLength);
		statsTyreProv.addLaps(lapsCompleted, lapLength);
		yearStatsTyreProv.addLaps(lapsCompleted, lapLength);
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
		return driverStats.map(ds -> ds.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
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
		return teamStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
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
		return chassisStats.map(ts -> ts.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
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
		return engineStats.map(es -> es.getYearsStatistics()).orElseGet(ArrayList<Integer>::new);
	}

}

package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.*;
import com.icesoft.msdb.service.RacetrackService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.stats.ChassisStatistics;
import com.icesoft.msdb.domain.stats.DriverStatistics;
import com.icesoft.msdb.domain.stats.EngineStatistics;
import com.icesoft.msdb.domain.stats.ParticipantStatistics;
import com.icesoft.msdb.domain.stats.ParticipantStatisticsSnapshot;
import com.icesoft.msdb.domain.stats.Result;
import com.icesoft.msdb.domain.stats.TeamStatistics;
import com.icesoft.msdb.repository.mongo.stats.ChassisStatisticsRepository;
import com.icesoft.msdb.repository.mongo.stats.DriverStatisticsRepository;
import com.icesoft.msdb.repository.mongo.stats.EngineStatisticsRepository;
import com.icesoft.msdb.repository.mongo.stats.RacetrackLayoutStatisticsRepository;
import com.icesoft.msdb.repository.mongo.stats.TeamStatisticsRepository;
import com.icesoft.msdb.repository.mongo.stats.TyreProviderStatisticsRepository;
import com.icesoft.msdb.service.StatisticsService;
import org.springframework.util.Assert;

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
	private final SeriesCategoryDriverChampionRepository seriesCategoryDriverChampionRepo;
    private final RacetrackService racetrackService;

	public StatisticsServiceImpl(
			EventEditionRepository eventEditionRepo,
			EventEntryRepository entriesRepo,
			EventEntryResultRepository resultsRepo,
			DriverEventPointsRepository driverPointsRepo,
			DriverStatisticsRepository driverStatsRepo,
			TeamStatisticsRepository teamStatsRepo,
			ChassisStatisticsRepository chassisStatsRepo,
			EngineStatisticsRepository engineStatsRepo,
			TyreProviderStatisticsRepository tyreProvStatsRepo,
			RacetrackLayoutStatisticsRepository racetrackLayoutStatsRepo,
            SeriesCategoryDriverChampionRepository seriesCategoryDriverChampionRepo,
            RacetrackService racetrackService) {
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
		this.seriesCategoryDriverChampionRepo = seriesCategoryDriverChampionRepo;
		this.racetrackService = racetrackService;
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
        Assert.notNull(eventEditionId, "No provided event edition id");
		buildEventStatistics(eventEditionRepo.findById(eventEditionId)
            .orElseThrow(() -> new MSDBException("Invalid event edition id " + eventEditionId)));
	}

	@SuppressWarnings("rawtypes")
	private void updateStats(String categoryName, String year, Result result,
			MongoRepository mongoRepo, ParticipantStatisticsSnapshot eStats) {
		updateStats(categoryName, year, result, mongoRepo, eStats, 10);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void updateStats(String categoryName, String year, Result result,
			MongoRepository mongoRepo, ParticipantStatisticsSnapshot eStats, int retries) {
		ParticipantStatistics statsDoc = eStats.getStaticsForCategory(categoryName);
		ParticipantStatistics statsDocYear = eStats.getStaticsForCategory(categoryName, year).orElse(new ParticipantStatistics());
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
			List<String> categoryName;
			String year = entry.getEventEdition().getEditionYear().toString();
			if (entry.getEventEdition().getSeriesEditions() != null) {
				categoryName = entry.getEventEdition().getSeriesEditions().parallelStream()
						.map(se -> se.getSeries().getName()).collect(Collectors.toList());
			} else {
				categoryName = new ArrayList<>();
				categoryName.add(entry.getEventEdition().getEvent().getName());
			}

			entry.getDrivers().stream().forEach(driver -> {
				DriverStatistics dStats = driverStatsRepo.findById(driver.getDriver().getId().toString())
						.orElse(new DriverStatistics(driver.getDriver().getId().toString()));
				categoryName.stream().forEach(cat -> updateStats(cat, year, result, driverStatsRepo, dStats));
			});

			if (entry.getTeam() != null) {
				TeamStatistics tStats = teamStatsRepo.findById(entry.getTeam().getId().toString())
						.orElse(new TeamStatistics(entry.getTeam().getId().toString()));
				categoryName.stream().forEach(cat -> updateStats(cat, year, result, teamStatsRepo, tStats));
			}

			ChassisStatistics cStats = chassisStatsRepo.findById(entry.getChassis().getId().toString())
					.orElse(new ChassisStatistics(entry.getChassis().getId().toString()));
			categoryName.stream().forEach(cat -> updateStats(cat, year, result, chassisStatsRepo, cStats));

			if (entry.getEngine() != null) {
				EngineStatistics eStats = engineStatsRepo.findById(entry.getEngine().getId().toString())
						.orElse(new EngineStatistics(entry.getEngine().getId().toString()));
				categoryName.stream().forEach(cat -> updateStats(cat, year, result, engineStatsRepo, eStats));
			}

		});

		log.debug("Statistics for event {} rebuilt", event.getLongEventName());
	}

	public void buildSeriesStatistics(SeriesEdition series) {
		series.getEvents().parallelStream().forEach(this::buildEventStatistics);
	}

	private List<Result> processEntry(EventEditionEntry entry) {
		List<EventEntryResult> results = resultsRepo.findByEntryIdAndSessionSessionType(entry.getId(), SessionType.RACE);
		Integer lapsCompleted = resultsRepo.countLapsCompletedInEvent(entry.getId());
		return createResultObject(entry, results, lapsCompleted);
	}

	@Override
	public void removeEventStatistics(Long eventEditionId) {
	    Assert.notNull(eventEditionId, "No event edition id provided");
		removeEventStatistics(eventEditionRepo.findById(eventEditionId)
            .orElseThrow(() -> new MSDBException("Invalid event edition id " + eventEditionId)));
	}

	@Override
	public void removeEventStatistics(EventEdition event) {
		String year = event.getEditionYear().toString();
		entriesRepo.findEventEditionEntries(event.getId()).stream().forEach((entry) -> {
			entry.getDrivers().parallelStream().forEach((driver) -> {
				Optional<DriverStatistics> ds = driverStatsRepo.findById(driver.getId().toString());
				if (ds.isPresent()) {
					ds.get().removeStatisticsOfEvent(event.getId(), year);
					driverStatsRepo.save(ds.get());
				}
			});

			if (entry.getTeam() != null) {
				Optional<TeamStatistics> ts = teamStatsRepo.findById(entry.getTeam().getId().toString());
				if (ts.isPresent()) {
					ts.get().removeStatisticsOfEvent(event.getId(), year);
					teamStatsRepo.save(ts.get());
				}
			}

			Optional<ChassisStatistics> cs = chassisStatsRepo.findById(entry.getChassis().getId().toString());
			if (cs.isPresent()) {
				cs.get().removeStatisticsOfEvent(event.getId(), year);
				chassisStatsRepo.save(cs.get());
			}

			if (entry.getEngine() != null) {
				Optional<EngineStatistics> es = engineStatsRepo.findById(entry.getEngine().getId().toString());
				if (es.isPresent()) {
					es.get().removeStatisticsOfEvent(event.getId(), year);
					engineStatsRepo.save(es.get());
				}
			}
		});
	}

	private List<Result> createResultObject(EventEditionEntry entry, List<EventEntryResult> results, Integer lapsCompleted) {
        RacetrackLayout layout = racetrackService.findLayout(entry.getEventEdition().getTrackLayout().getId());

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
            log.trace("Retrieving fastest laps for entry {}", result.getEntry().getEntryName());
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
					entry.getDrivers().stream().findFirst().get().getDriver().getId())).orElse(Float.valueOf(0));

			result.getEntry().getEventEdition().setTrackLayout(layout);
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
	public Map<String, ParticipantStatistics> getDriverStatistics(Long driverId) {
		Optional<DriverStatistics> driverStats = driverStatsRepo.findById(driverId.toString());
		return driverStats.map(ParticipantStatisticsSnapshot::getStatistics).orElseGet(HashMap<String, ParticipantStatistics> :: new);
	}

	@Override
	public Map<String, ParticipantStatistics> getDriverStatistics(Long driverId, String year) {
		Optional<DriverStatistics> driverStats = driverStatsRepo.findById(driverId.toString());
		return driverStats.map(ds -> ds.getStatisticsYear(year).orElseGet(HashMap<String, ParticipantStatistics> :: new)).get();
	}

	@Override
	public List<String> getDriverYearsStatistics(Long driverId) {
        Optional<DriverStatistics> driverStats = driverStatsRepo.findById(driverId.toString());
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
	public Map<String, ParticipantStatistics> getTeamStatistics(Long teamId) {
        Optional<TeamStatistics> teamStats = teamStatsRepo.findById(teamId.toString());
		return teamStats.map(ParticipantStatisticsSnapshot::getStatistics)
            .orElseGet(HashMap<String, ParticipantStatistics> :: new);
	}

	@Override
	public Map<String, ParticipantStatistics> getTeamStatistics(Long teamId, String year) {
        Optional<TeamStatistics> teamStats = teamStatsRepo.findById(teamId.toString());
		return teamStats.map(ts -> ts.getStatisticsYear(year).orElseGet(HashMap<String, ParticipantStatistics> :: new)).get();
	}

	@Override
	public List<String> getTeamYearsStatistics(Long teamId) {
        Optional<TeamStatistics> teamStats = teamStatsRepo.findById(teamId.toString());
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
	public Map<String, ParticipantStatistics> getChassisStatistics(Long chassisId) {
        Optional<ChassisStatistics> chassisStats = chassisStatsRepo.findById(chassisId.toString());
		return chassisStats.map(ParticipantStatisticsSnapshot::getStatistics).orElseGet(HashMap<String, ParticipantStatistics> :: new);
	}

	@Override
	public Map<String, ParticipantStatistics> getChassisStatistics(Long chassisId, String year) {
        Optional<ChassisStatistics> chassisStats = chassisStatsRepo.findById(chassisId.toString());
		return chassisStats.map(cs -> cs.getStatisticsYear(year).orElseGet(HashMap<String, ParticipantStatistics> :: new)).get();
	}

	@Override
	public List<String> getChassisYearsStatistics(Long chassisId) {
        Optional<ChassisStatistics> chassisStats = chassisStatsRepo.findById(chassisId.toString());
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
	public Map<String, ParticipantStatistics> getEngineStatistics(Long engineId) {
        Optional<EngineStatistics> engineStats = engineStatsRepo.findById(engineId.toString());
		return engineStats.map(ParticipantStatisticsSnapshot::getStatistics).orElseGet(HashMap<String, ParticipantStatistics> :: new);
	}

	@Override
	public Map<String, ParticipantStatistics> getEngineStatistics(Long engineId, String year) {
        Optional<EngineStatistics> engineStats = engineStatsRepo.findById(engineId.toString());
		return engineStats.map(cs -> cs.getStatisticsYear(year).orElseGet(HashMap<String, ParticipantStatistics> :: new)).get();
	}

	@Override
	public List<String> getEngineYearsStatistics(Long engineId) {
        Optional<EngineStatistics> engineStats = engineStatsRepo.findById(engineId.toString());
		List<String> result = engineStats.map(es -> es.getYearsStatistics()).orElseGet(ArrayList<String>::new);
		Comparator<Integer> normal = Integer::compare;
		Comparator<Integer> reversed = normal.reversed();
		return result.parallelStream()
				.map(Integer::parseInt)
				.sorted(reversed)
				.map(y -> y.toString())
				.collect(Collectors.toList());
	}

	@Override
	public void updateSeriesDriversChampions(SeriesEdition seriesEd) {
	    List<Driver> currentChamps = seriesCategoryDriverChampionRepo.getDriversChampions(seriesEd.getId());
        updateSeriesDriversChampions(seriesEd,
            currentChamps, currentChamps,
            seriesEd.getSeries().getName(), seriesEd.getPeriodEnd());
        updateSeriesTeamsChampions(seriesEd, seriesEd.getTeamsChampions(), seriesEd.getTeamsChampions(),
            seriesEd.getSeries().getName(), seriesEd.getPeriodEnd());
	}

	@Override
	public void updateSeriesDriversChampions(SeriesEdition seriesEd, List<Driver> currentChamps, List<Driver> newChamps, String categoryName, String period) {
		//Update statistics to remove championship won
		for(Driver d: currentChamps) {
			DriverStatistics ds = driverStatsRepo.findById(d.getId().toString()).get();
			ParticipantStatistics st = ds.getStaticsForCategory(categoryName);
			st.removeChampionship(seriesEd.getId());
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, period).orElse(new ParticipantStatistics());
			st.removeChampionship(seriesEd.getId());
			ds.updateStatistics(categoryName, st, period);
			driverStatsRepo.save(ds);
		}

		//Update statistics again for new champs
		for(Driver d: newChamps) {
			DriverStatistics ds = driverStatsRepo.findById(d.getId().toString()).get();
			ParticipantStatistics st = ds.getStaticsForCategory(categoryName);
			st.addChampionship(seriesEd.getEditionName(), period, seriesEd.getId());
			ds.updateStatistics(categoryName, st);
			st = ds.getStaticsForCategory(categoryName, period).orElse(new ParticipantStatistics());
			st.addChampionship(seriesEd.getEditionName(), period, seriesEd.getId());
			ds.updateStatistics(categoryName, st, period);
			driverStatsRepo.save(ds);
		}
	}

	@Override
	public void updateSeriesTeamsChampions(SeriesEdition seriesEd, List<Team> currentChamps, List<Team> newChamps, String category, String period) {
		//Update statistics to remove championship won
		for(Team t: currentChamps) {
			TeamStatistics ts = teamStatsRepo.findById(t.getId().toString()).get();
			ParticipantStatistics st = ts.getStaticsForCategory(category);
			st.removeChampionship(seriesEd.getId());
			ts.updateStatistics(category, st);
			st = ts.getStaticsForCategory(category, period).orElse(new ParticipantStatistics());
			st.removeChampionship(seriesEd.getId());
			ts.updateStatistics(category, st, period);
			teamStatsRepo.save(ts);
		}

		//Update statistics again for new champs

		for(Team t: seriesEd.getTeamsChampions()) {
			TeamStatistics ts = teamStatsRepo.findById(t.getId().toString()).get();
			ParticipantStatistics st = ts.getStaticsForCategory(category);
			st.addChampionship(seriesEd.getEditionName(), period, seriesEd.getId());
			ts.updateStatistics(category, st);
			st = ts.getStaticsForCategory(category, period).orElse(new ParticipantStatistics());
			st.addChampionship(seriesEd.getEditionName(), period, seriesEd.getId());
			ts.updateStatistics(category, st, period);
			teamStatsRepo.save(ts);
		}
	}

}

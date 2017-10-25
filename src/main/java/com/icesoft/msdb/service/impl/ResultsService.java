package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.DriverEventPoints;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.TeamEventPoints;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamEventPointsRepository;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.TeamPointsDTO;

@Service
@Transactional
public class ResultsService {
	private final Logger log = LoggerFactory.getLogger(ResultsService.class);
	
	@Autowired private EventSessionRepository sessionRepo;
	@Autowired private EventEntryResultRepository resultsRepo;
	@Autowired private DriverEventPointsRepository driverPointsRepo;
	@Autowired private TeamEventPointsRepository teamPointsRepo;
	@Autowired private SeriesEditionRepository seriesEditionRepo;
	@Autowired private JDBCRepositoryImpl viewsRepo;
	
	@Autowired private CacheHandler cacheHandler;

	public void processSessionResults(Long sessionId) {
		//TODO: Improve points system and series definition to handle other classifications (manufacturers, for instance)
		EventSession session = sessionRepo.findOne(sessionId);
		List<DriverEventPoints> drivers = new ArrayList<>();
		Map<Long, TeamEventPoints> teams = new HashMap<>();
		PointsSystem ps = session.getPointsSystem();
		
		if (ps == null) {
			log.debug("Skipping session {}-{} as it does not award points", session.getEventEdition().getLongEventName(), session.getName());
		} else {
			driverPointsRepo.deleteSessionPoints(sessionId);
			teamPointsRepo.deleteSessionPoints(sessionId);

			List<EventEntryResult> results = resultsRepo.findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAscLapsCompletedDesc(
					session.getId(), session.getEventEdition().getId());
			int[] points = ps.disclosePoints();
			for(int i = 0; i < results.size(); i++) {
				EventEntryResult result = results.get(i);
				Boolean sharedDrive = result.getSharedDriveWith() != null;
				
				float calculatedPoints = 0f;
				if (result.getFinalPosition() < 800 && result.getFinalPosition() <= points.length) {
					calculatedPoints = (float)points[result.getFinalPosition() - 1] * session.getPsMultiplier();
					if (sharedDrive) {
						calculatedPoints = calculatedPoints / 2;
					}
				}
				
				for(Driver d : result.getEntry().getDrivers()) {
					log.debug(result.getFinalPosition() + "-" + d.getFullName() + ": " + 
							(points.length > result.getFinalPosition() ? points[result.getFinalPosition() - 1] : 0));
					
					if (result.getFinalPosition() < 800 && points.length > i) {
						DriverEventPoints dep = new DriverEventPoints(d, session, session.getName());
						dep.addPoints(calculatedPoints);
						log.debug(String.format("Driver %s: %s(x%s) points for position %s", 
							d.getFullName(), (float)points[result.getFinalPosition() - 1], session.getPsMultiplier(), result.getFinalPosition()));
						drivers.add(dep);
						//calculatedPoints += dep.getPoints();
					}
					
					if (result.getStartingPosition() != null &&  result.getStartingPosition() == 1) {
						if (ps.getPointsPole() != 0) { // && session.getPsMultiplier().equals(new Float(1.0f))) {
							DriverEventPoints dep = new DriverEventPoints(d, session, "motorsportsDatabaseApp.pointsSystem.pointsPole");
							dep.addPoints(ps.getPointsPole().floatValue());
							log.debug(String.format("Driver %s: %s points for pole", d.getFullName(), ps.getPointsPole()));
							drivers.add(dep);
							//calculatedPoints = dep.getPoints();
						}
					}
				}
				if (sharedDrive) {
					for(Driver d: result.getSharedDriveWith().getDrivers()) {
						DriverEventPoints dep = new DriverEventPoints(d, session, session.getName());
						dep.addPoints(calculatedPoints);
						drivers.add(dep);
					}
				}
				
				if (session.getEventEdition().getSeriesEdition().getTeamsStandings()) {
					TeamEventPoints tep = teams.get(result.getEntry().getTeam().getId());
					if (tep == null) {
						tep = new TeamEventPoints();
						tep.setSession(session);
						tep.setTeam(result.getEntry().getTeam());
					}
					log.debug(String.format("Team %s: %s points for position %s", result.getEntry().getTeam().getName(), calculatedPoints, result.getFinalPosition()));
					tep.addPoints(calculatedPoints);
					teams.put(result.getEntry().getTeam().getId(), tep);
				}
				
				if (session.getEventEdition().getSeriesEdition().getManufacturersStandings()) {
					//TODO
				}
			}
			
			log.debug("Race points calculated... proceeding with extra points");
			if (ps.getPointsFastLap() != 0) {
				List<EventEntryResult> fastestLapOrder = results.parallelStream().sorted(
						(r1, r2)->Long.compare(
									r1.getBestLapTime() == null ? Long.MAX_VALUE : r1.getBestLapTime(), 
									r2.getBestLapTime() == null ? Long.MAX_VALUE : r2.getBestLapTime()))
						.collect(Collectors.toList());
				
				EventEntryResult fastestEntry;
				Stream<EventEntryResult> filtered = fastestLapOrder.parallelStream();
				if (ps.getMinimumFinishingPosition() != 0) {
					filtered = filtered.filter(eer -> eer.getFinalPosition() <= ps.getMinimumFinishingPosition());
				}
				if (!ps.isPitlaneStartAllowed()) {
					filtered = filtered.filter(eer -> !eer.isPitlaneStart());
				}
				if (ps.getPctCompleted() != 0) {
					//We assume that duration will always be laps if minimum percentage completion needs to be applied
					filtered = filtered.filter(eer -> (eer.getLapsCompleted().floatValue() / eer.getSession().getDuration().floatValue()) * 100f >= ps.getPctCompleted());
				}
				fastestLapOrder = filtered.collect(Collectors.toList());
				if (!fastestLapOrder.isEmpty()) {
					fastestEntry = fastestLapOrder.get(0);
					if (fastestEntry.getBestLapTime() != null) {
						for(Driver d : fastestEntry.getEntry().getDrivers()) {
							DriverEventPoints dep = new DriverEventPoints(d, session, "motorsportsDatabaseApp.pointsSystem.pointsFastLap");
							dep.addPoints(ps.getPointsFastLap().floatValue());
							log.debug(String.format("Driver %s: %s points for fastest lap", d.getFullName(), ps.getPointsFastLap()));
							drivers.add(dep);
						}
					} else {
						log.warn("No fastest lap recorded... skipping");
					}
				} else {
					log.warn("No recorded fast lap complied with all the requirements");
				}
			}
			if (ps.getPointsLeadLap() != 0 || ps.getPointsMostLeadLaps() != 0) {
				List<EventEntryResult> ledLaps = results.parallelStream()
						.filter(r -> r.getLapsLed() > 0)
						.sorted((r1, r2) -> Integer.compare(r2.getLapsLed(), r1.getLapsLed())).collect(Collectors.toList());
				
				Comparator<EventEntryResult> c = (r1, r2) -> {
					if (r1.getLapsLed().equals(r2.getLapsLed())) {
						return r1.getFinalPosition().compareTo(r2.getFinalPosition());
					} else {
						return r1.getLapsLed().compareTo(r2.getLapsLed()) * -1;
					}
				};
				
				ledLaps.sort(c);
				
				int maxLedLaps = 0;
				for(EventEntryResult r : ledLaps) {
					boolean addPointsMostLeadLaps = false;
					if (r.getLapsLed() > maxLedLaps && maxLedLaps == 0) { //|| r.getLapsLed() == maxLedLaps) {
						maxLedLaps = r.getLapsLed();
						addPointsMostLeadLaps = true;
					}
					for(Driver d : r.getEntry().getDrivers()) {
						DriverEventPoints dep = new DriverEventPoints(d, session, "motorsportsDatabaseApp.pointsSystem.pointsLeadLap");
						dep.addPoints(ps.getPointsLeadLap().floatValue());
						log.debug(String.format("Driver %s: %s points for leading %s laps", d.getFullName(), ps.getPointsLeadLap(), r.getLapsLed()));
						drivers.add(dep);
						if (addPointsMostLeadLaps) {
							dep = new DriverEventPoints(d, session, "motorsportsDatabaseApp.pointsSystem.pointsMostLeadLaps");
							dep.addPoints(ps.getPointsMostLeadLaps().floatValue());
							log.debug(String.format("Driver %s: %s points for most led laps", d.getFullName(), ps.getPointsMostLeadLaps()));
							drivers.add(dep);
						}
					}
				}
			}
			log.debug("Persisting points...");
			drivers.stream().forEach(entry -> driverPointsRepo.save(entry));
			teams.entrySet().stream().forEach(entry -> teamPointsRepo.save(entry.getValue()));
			
			cacheHandler.resetDriversStandingsCache(session.getSeriesId());
			
		}
		log.info("Processed result for {}-{}.", session.getEventEdition().getLongEventName(), session.getName());
	}
	
	public List<DriverPointsDTO> getDriversStandings(Long seriesId) {
		List<DriverPointsDTO> standings = viewsRepo.getDriversStandings(seriesId);
		Map<Long, List<Object[]>> positions = viewsRepo.getDriversResultsInSeries(seriesId);
		
		Comparator<DriverPointsDTO> c = (o1, o2) -> {
			if (o1.getPoints().floatValue() != o2.getPoints().floatValue()) {
				return o1.getPoints().compareTo(o2.getPoints());
			} else {
				List<Object[]> positionsD1 = positions.get(o1.getDriverId());
				List<Object[]> positionsD2 = positions.get(o2.getDriverId());
				
				return sortPositions(positionsD1, positionsD2);
			}
		};
		
		standings.sort(c.reversed());
		return standings;
	}
	
	public List<DriverPointsDTO> getDriversPointsEvent(Long eventId) {
		List<Object[]> pointsEvent = driverPointsRepo.getDriversPointsInEvent(eventId);
		
		return pointsEvent.parallelStream().map(dep -> new DriverPointsDTO(
				null,
				(Long)dep[0],
				(String)dep[1] + " " + (String)dep[2],
				((Double)dep[3]).floatValue(),
				((Long)dep[4]).intValue(), "")).collect(Collectors.toList());
	}
	
	public List<DriverPointsDTO> getDriverPointsEvent(Long eventId, Long driverId) {
		List<Object[]> pointsEvent = driverPointsRepo.getListDriverPointsInEvent(eventId, driverId);
		
		return pointsEvent.parallelStream().map(dep -> new DriverPointsDTO(
				(Long)dep[0], (String)dep[1] + " " + (String)dep[2], 
				(Float)dep[3], (String)dep[4])).collect(Collectors.toList());
	}
	
	protected List<Long> getChampionsDriverIds(Long seriesId) {
		List<Long> result = new ArrayList<>();
		List<DriverPointsDTO> standings = viewsRepo.getDriversStandings(seriesId);
		Map<Long, List<Object[]>> positions = viewsRepo.getDriversResultsInSeries(seriesId);
		SeriesEdition series = seriesEditionRepo.findOne(seriesId);
		
		Float maxPoints = standings.parallelStream().map(dp -> dp.getPoints()).max((dp1, dp2) -> dp1.compareTo(dp2)).orElse(new Float(-1));
		
		standings = standings.parallelStream().filter(dp -> dp.getPoints().equals(maxPoints)).collect(Collectors.toList());
		if (standings.isEmpty()) {
			return result;
		} else if (standings.size() == 1) {
			result.add(standings.get(0).getDriverId());
			return result;
		} else {
			if (standings.get(0).getPoints().equals(0f)) {
				return result;
			}
			
			Comparator<DriverPointsDTO> c = (o1, o2) -> {
				List<Object[]> positionsD1 = positions.get(o1.getDriverId());
				List<Object[]> positionsD2 = positions.get(o2.getDriverId());
				
				return sortPositions(positionsD1, positionsD2);
			};
			standings.sort(c.reversed());
			
			DriverPointsDTO champ = standings.get(0);
			if (series.isMultidriver()) {
				return standings.parallelStream()
						.map(dp -> dp.getDriverId()).collect(Collectors.toList());
			} else {
				List<Long> tmp = new ArrayList<>();
				tmp.add(champ.getDriverId());
				return tmp;
			}
		}
	}
	
	public List<TeamPointsDTO> getTeamsStandings(Long seriesId) {
		List<TeamPointsDTO> standings = viewsRepo.getTeamsStandings(seriesId);
		Map<Long, List<Object[]>> positions = viewsRepo.getTeamsResultsInSeries(seriesId);
		
		Comparator<TeamPointsDTO> c = (o1, o2) -> {
			if (o1.getPoints().floatValue() != o2.getPoints().floatValue()) {
				return o1.getPoints().compareTo(o2.getPoints());
			} else {
				List<Object[]> positionsT1 = positions.get(o1.getTeamId());
				List<Object[]> positionsT2 = positions.get(o2.getTeamId());
				
				return sortPositions(positionsT1, positionsT2);
			}
		};
		
		standings.sort(c.reversed());
		return standings;
	}

	private int sortPositions(List<Object[]> positionsD1, List<Object[]> positionsD2) {
		Comparator<Object[]> pc = (pc1, pc2) -> ((Integer)pc1[0]).compareTo((Integer)pc2[0]);
		if (positionsD1 != null) positionsD1.sort(pc);
		if (positionsD2 != null) positionsD2.sort(pc);
		
		if (positionsD1 == null || positionsD1.isEmpty()) {
			if (positionsD2 == null || positionsD2.isEmpty()) {
				return 0;
			} else {
				return -1;
			}
		} else {
			if (positionsD2 == null || positionsD2.isEmpty()) {
				return 1;
			} else {
				for(int i = 0; i < positionsD1.size(); i++) {
					if (i + 1 > positionsD2.size()) {
						return 1;
					}
					Integer pD1, tD1, pD2, tD2;
					pD1 = (Integer)positionsD1.get(i)[0];
					tD1 = (Integer)positionsD1.get(i)[1];
					pD2 = (Integer)positionsD2.get(i)[0];
					tD2 = (Integer)positionsD2.get(i)[1];
					if (pD1.intValue() > pD2.intValue()) {
						return -1;
					} else if (pD1.intValue() < pD2.intValue()) {
						return 1;
					} else {
						if (tD1.intValue() > tD2.intValue()) {
							return 1;
						} else if (tD1.intValue() < tD2.intValue()) {
							return -1;
						}
					}
				}
				if (positionsD2.size() > positionsD1.size()) {
					return -1;
				}
				return 0;
			}
		}
	}
}

package com.icesoft.msdb.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import com.icesoft.msdb.domain.TeamEventPoints;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.TeamEventPointsRepository;

@Service
@Transactional
public class ResultsService {
	private final Logger log = LoggerFactory.getLogger(ResultsService.class);
	
	@Autowired private EventSessionRepository sessionRepo;
	@Autowired private EventEntryResultRepository resultsRepo;
	@Autowired private DriverEventPointsRepository driverPointsRepo;
	@Autowired private TeamEventPointsRepository teamPointsRepo;

	public void processSessionResults(Long sessionId) {
		EventSession session = sessionRepo.findOne(sessionId);
		Map<Long, DriverEventPoints> drivers = new HashMap<>();
		Map<Long, TeamEventPoints> teams = new HashMap<>();
		PointsSystem ps = session.getPointsSystem();
		if (!session.getAwardsPoints()) {
			log.debug("Skipping session {}-{} as it does not award points", session.getEventEdition().getLongEventName(), session.getName());
		} else {
			driverPointsRepo.deleteSessionPoints(sessionId);
			//teamPointsRepo.deleteSessionPoints(sessionId);

			List<EventEntryResult> results = resultsRepo.findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAsc(session.getId(), session.getEventEdition().getId());
			int[] points = ps.disclosePoints();
			for(int i = 0; i < ps.disclosePoints().length; i++) {
				//TODO: Handle shared drives (half points)
				EventEntryResult result = results.get(i);
				TeamEventPoints tep = teams.get(result.getEntry().getTeam().getId());
				if (tep == null) {
					tep = new TeamEventPoints();
				}
				tep.addPoints((float)points[i]);
				
				for(Driver d : result.getEntry().getDrivers()) {
					log.debug(result.getFinalPosition() + "-" + d.getFullName() + ": " + points[i]);
					DriverEventPoints dep = drivers.get(d.getId());
					if (dep == null) {
						dep = new DriverEventPoints();
					}
					dep.setDriver(d);
					dep.setSession(session);
					dep.addPoints((float)points[i]);
					drivers.put(d.getId(), dep);
					if (result.getStartingPosition() != null &&  result.getStartingPosition() == 1) {
						if (ps.getPointsPole() != 0) {
							dep.addPoints(ps.getPointsPole().floatValue());
						}
					}
				}
			}
			if (ps.getPointsFastLap() != 0) {
				EventEntryResult fastestEntry = results.parallelStream().min(
						(r1, r2)->Long.compare(r1.getBestLapTime() == null ? -1 : r1.getBestLapTime(), 
											   r2.getBestLapTime() == null ? -1 : r2.getBestLapTime())).get();
				if (fastestEntry.getBestLapTime() != null) {
					for(Driver d : fastestEntry.getEntry().getDrivers()) {
						log.debug("Fastest lap: " + d.getFullName() + ": " + fastestEntry.getBestLapTime());
						DriverEventPoints dep = drivers.get(d.getId());
						if (dep == null) {
							dep = new DriverEventPoints();
						}
						dep.addPoints(ps.getPointsFastLap().floatValue());
						drivers.put(d.getId(), dep);
					}
				} else {
					log.warn("No fastest lap recorded... skipping");
				}
			}
			if (ps.getPointsLeadLap() != 0) {
				List<EventEntryResult> ledLaps = results.parallelStream()
						.filter(r -> r.getLapsLed() > 0)
						.sorted((r1, r2) -> Integer.compare(r2.getLapsLed(), r1.getLapsLed())).collect(Collectors.toList());
				int maxLedLaps = 0;
				for(EventEntryResult r : ledLaps) {
					boolean addPointsMostLeadLaps = false;
					if ((r.getLapsLed() > maxLedLaps && maxLedLaps == 0) || r.getLapsLed() == maxLedLaps) {
						maxLedLaps = r.getLapsLed();
						addPointsMostLeadLaps = true;
					}
					for(Driver d : r.getEntry().getDrivers()) {
						log.debug(r.getFinalPosition() + "-" + d.getFullName() + ": Led laps" + r.getLapsLed());
						DriverEventPoints dep = drivers.get(d.getId());
						if (dep == null) {
							dep = new DriverEventPoints();
						}
						dep.addPoints(ps.getPointsLeadLap().floatValue());
						if (addPointsMostLeadLaps) {
							dep.addPoints(ps.getPointsMostLeadLaps().floatValue());
						}
						drivers.put(d.getId(), dep);
					}
				}
			}
			
			for(Long dId : drivers.keySet()) {
				DriverEventPoints dep = drivers.get(dId);
				driverPointsRepo.save(dep);
			}
			for(Long tId : teams.keySet()) {
				TeamEventPoints tep = teams.get(tId);
				teamPointsRepo.save(tep);
			}
		}
	}
}

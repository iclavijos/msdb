package com.icesoft.msdb.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;

@Service
@Transactional
public class ResultsService {
	private final Logger log = LoggerFactory.getLogger(ResultsService.class);
	
	@Autowired private EventSessionRepository sessionRepo;
	@Autowired private EventEntryResultRepository resultsRepo;

	public void processSessionResults(Long sessionId) {
		EventSession session = sessionRepo.findOne(sessionId);
		if (!session.getAwardsPoints()) {
			log.debug("Session {}-{} as it does not award points", session.getEventEdition().getLongEventName(), session.getName());
		} else {
			PointsSystem ps = session.getPointsSystem();
			List<EventEntryResult> results = resultsRepo.findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAsc(session.getId(), session.getEventEdition().getId());
			int[] points = ps.disclosePoints();
			for(int i = 0; i < ps.disclosePoints().length; i++) {
				EventEntryResult result = results.get(i);
				for(Driver d : result.getEntry().getDrivers()) {
					System.out.println(result.getFinalPosition() + "-" + d.getFullName() + ": " + points[i]);
				}
			}
			EventEntryResult fastestEntry = results.parallelStream().min(
					(r1, r2)->Long.compare(r1.getBestLapTime() == null ? -1 : r1.getBestLapTime(), 
										   r2.getBestLapTime() == null ? -1 : r2.getBestLapTime())).get();
			if (fastestEntry.getBestLapTime() != null) {
				for(Driver d : fastestEntry.getEntry().getDrivers()) {
					System.out.println(" Fastest lap: " + d.getFullName() + ": " + fastestEntry.getBestLapTime());
				}
			} else {
				System.out.println("No fastest lap recorded... skipping");
			}
			List<EventEntryResult> ledLaps = results.parallelStream()
					.filter(r -> r.getLapsLed() > 0)
					.sorted((r1, r2) -> Integer.compare(r2.getLapsLed(), r1.getLapsLed())).collect(Collectors.toList());
			for(EventEntryResult r : ledLaps) {
				for(Driver d : r.getEntry().getDrivers()) {
					System.out.println(r.getFinalPosition() + "-" + d.getFullName() + ": Led laps" + r.getLapsLed());
				}
			}
		}
	}
}

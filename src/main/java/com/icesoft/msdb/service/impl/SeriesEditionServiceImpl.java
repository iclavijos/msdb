package com.icesoft.msdb.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamEventPointsRepository;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;

@Service
@Transactional
public class SeriesEditionServiceImpl implements SeriesEditionService {
	
	private final EventEditionRepository eventRepo;
	private final SeriesEditionRepository seriesRepo;
	private final EventSessionRepository sessionRepo;
	private final PointsSystemRepository pointsRepo;
	private final DriverEventPointsRepository driverPointsRepo;
	private final TeamEventPointsRepository teamPointsRepo;
	
	public SeriesEditionServiceImpl(EventEditionRepository eventRepo, SeriesEditionRepository seriesRepo, 
			EventSessionRepository sessionRepo, PointsSystemRepository pointsRepo, 
			DriverEventPointsRepository driverPointsRepo, TeamEventPointsRepository teamPointsRepo) {
		this.eventRepo = eventRepo;
		this.seriesRepo = seriesRepo;
		this.sessionRepo = sessionRepo;
		this.pointsRepo = pointsRepo;
		this.driverPointsRepo = driverPointsRepo;
		this.teamPointsRepo = teamPointsRepo;
	}

	@Override
	public void addEventToSeries(Long seriesId, Long idEvent, List<EventRacePointsDTO> racesPointsData) {
		SeriesEdition seriesEd = seriesRepo.findOne(seriesId);
		if (seriesEd == null) {
			throw new MSDBException("No series edition found for id '" + seriesId + "'");
		}
		EventEdition eventEd = null;

		racesPointsData.parallelStream().forEach(racePoints -> {
			EventSession session = sessionRepo.findOne(racePoints.getRaceId());
			if (!racePoints.isAssigned()) {
				session.setPointsSystem(null);
				session.setPsMultiplier(0f);
			} else {
				PointsSystem points = pointsRepo.findOne(racePoints.getpSystemAssigned());
				if (session == null || points == null) {
					throw new MSDBException(
							String.format("Provided points for race data invalid [%s, %s]", 
									racePoints.getRaceId(), 
									racePoints.getpSystemAssigned()));
				}
				session.setPointsSystem(points);
				session.setPsMultiplier(racePoints.getPsMultiplier());
			}
			sessionRepo.save(session);
		});
		
		eventEd = eventRepo.findOne(idEvent);
		eventEd.setSeriesEdition(seriesEd);
		eventRepo.save(eventEd);
	}

	@Override
	public void removeEventFromSeries(Long seriesId, Long eventId) {
		EventEdition eventEd = eventRepo.findOne(eventId);
		if (eventId == null) {
			throw new MSDBException("No event edition found for id '" + eventId + "'");
		}
		if (!eventEd.getSeriesEdition().getId().equals(seriesId)) {
			throw new MSDBException("Provided series id does not match the already assigned one");
		}
		eventEd.setSeriesEdition(null);
		sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId).parallelStream()
			.forEach(session -> {
				session.setPointsSystem(null);
				sessionRepo.save(session);
			});
		eventRepo.save(eventEd);
		
		//We must remove the assigned points, if there are any
		sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventId).stream()
			.forEach(session -> {
				driverPointsRepo.deleteSessionPoints(session.getId());
				teamPointsRepo.deleteSessionPoints(session.getId());
			});
	}

	@Transactional(readOnly=true)
	public List<EventEdition> findSeriesEvents(Long seriesId) {
		return eventRepo.findBySeriesEditionIdOrderByEventDateAsc(seriesId);
	}

}

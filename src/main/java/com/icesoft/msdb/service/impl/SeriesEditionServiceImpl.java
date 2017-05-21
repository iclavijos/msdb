package com.icesoft.msdb.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.PointsSystem;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;

@Service
@Transactional
public class SeriesEditionServiceImpl implements SeriesEditionService {
	
	private final EventEditionRepository eventRepo;
	private final SeriesEditionRepository seriesRepo;
	private final EventSessionRepository sessionRepo;
	private final PointsSystemRepository pointsRepo;
	
	public SeriesEditionServiceImpl(EventEditionRepository eventRepo, SeriesEditionRepository seriesRepo, 
			EventSessionRepository sessionRepo, PointsSystemRepository pointsRepo) {
		this.eventRepo = eventRepo;
		this.seriesRepo = seriesRepo;
		this.sessionRepo = sessionRepo;
		this.pointsRepo = pointsRepo;
	}

	@Override
	public void addEventToSeries(Long seriesId, List<EventRacePointsDTO> racesPointsData) {
		SeriesEdition seriesEd = seriesRepo.findOne(seriesId);
		if (seriesEd == null) {
			throw new MSDBException("No series edition found for id '" + seriesId + "'");
		}
		EventEdition eventEd = null;
		for(EventRacePointsDTO racePoints : racesPointsData) {
			EventSession session = sessionRepo.findOne(racePoints.getRaceId());
			PointsSystem points = pointsRepo.findOne(racePoints.getpSystemAssigned());
			if (session == null || points == null) {
				throw new MSDBException(
						String.format("Provided points for race data invalid [%s, %s]", 
								racePoints.getRaceId(), 
								racePoints.getpSystemAssigned()));
			}
			session.setPointsSystem(points);
			sessionRepo.save(session);
			eventEd = session.getEventEdition();
		}
		
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
		eventRepo.save(eventEd);
	}

	@Transactional(readOnly=true)
	public List<EventEdition> findSeriesEvents(Long seriesId) {
		return eventRepo.findBySeriesEditionIdOrderByEventDateAsc(seriesId);
	}

}

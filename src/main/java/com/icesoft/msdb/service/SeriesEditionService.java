package com.icesoft.msdb.service;

import java.util.List;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;

public interface SeriesEditionService {

	public void addEventToSeries(Long seriesId, List<EventRacePointsDTO> racesPointsData);
	
	public void removeEventFromSeries(Long seriesId, Long eventId);
	
	public List<EventEdition> findSeriesEvents(Long seriesId);
}

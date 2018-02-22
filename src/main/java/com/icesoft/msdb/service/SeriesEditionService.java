package com.icesoft.msdb.service;

import java.util.List;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;
import com.icesoft.msdb.service.dto.SeriesEventsAndWinnersDTO;

public interface SeriesEditionService {

	public void addEventToSeries(Long seriesId, Long idEvent, List<EventRacePointsDTO> racesPointsData);
	
	public void removeEventFromSeries(Long seriesId, Long eventId);
	
	public List<EventEdition> findSeriesEvents(Long seriesId);
	
	public void setSeriesDriversChampions(Long seriesEditionId, List<Long> driverIds);
	
	public List<Driver> getSeriesDriversChampions(Long seriesEditionId);
	
	public void setSeriesTeamsChampions(Long seriesEditionId, List<Long> teamsIds);
	
	public List<Team> getSeriesTeamsChampions(Long seriesEditionId);
	
	public List<SeriesEventsAndWinnersDTO> getSeriesEditionsEventsAndWinners(Long seriesEditionId);
	
}

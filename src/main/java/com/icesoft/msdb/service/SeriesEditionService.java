package com.icesoft.msdb.service;

import java.util.List;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.service.dto.DriverCategoryChampionDTO;
import com.icesoft.msdb.service.dto.EventRacePointsDTO;
import com.icesoft.msdb.service.dto.SeriesEventsAndWinnersDTO;

public interface SeriesEditionService {

    SeriesEdition createSeriesEdition(SeriesEdition seriesEdition);

    void deleteSeriesEdition(SeriesEdition seriesEdition);

    SeriesEdition updateSeriesEdition(SeriesEdition seriesEdition);

	void addEventToSeries(Long seriesId, Long idEvent, List<EventRacePointsDTO> racesPointsData);

	void removeEventFromSeries(Long seriesId, Long eventId);

	List<EventEdition> findSeriesEvents(Long seriesId);

	void setSeriesDriversChampions(Long seriesEditionId, List<DriverCategoryChampionDTO> driverIds);

	List<Driver> getSeriesDriversChampions(Long seriesEditionId);

	List<Driver> getSeriesCategoryDriversChampions(Long seriesEditionId, Long categoryId);

	void setSeriesTeamsChampions(Long seriesEditionId, List<Long> teamsIds);

	List<Team> getSeriesTeamsChampions(Long seriesEditionId);

	List<SeriesEventsAndWinnersDTO> getSeriesEditionsEventsAndWinners(Long seriesEditionId);

	void cloneSeriesEdition(Long seriesEditionId, String newPeriod);

}

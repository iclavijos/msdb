package com.icesoft.msdb.service;

import java.util.List;
import java.util.Map;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.Team;
import com.icesoft.msdb.domain.stats.ParticipantStatistics;

public interface StatisticsService {

	void deleteAllStatistics();

	void buildEventStatistics(Long eventEditionId);

	void buildEventStatistics(EventEdition eventEdition);

	void removeEventStatistics(Long eventEditionId);

	void removeEventStatistics(EventEdition event);

	void buildSeriesStatistics(SeriesEdition series);

	Map<String, ParticipantStatistics> getDriverStatistics(Long driverId);

	Map<String, ParticipantStatistics> getDriverStatistics(Long driverId, String year);

	List<String> getDriverYearsStatistics(Long driverId);

	Map<String, ParticipantStatistics> getTeamStatistics(Long teamId);

	Map<String, ParticipantStatistics> getTeamStatistics(Long teamId, String year);

	List<String> getTeamYearsStatistics(Long teamId);

	Map<String, ParticipantStatistics> getChassisStatistics(Long chassisId);

	Map<String, ParticipantStatistics> getChassisStatistics(Long chassisId, String year);

	List<String> getChassisYearsStatistics(Long chassisId);

	Map<String, ParticipantStatistics> getEngineStatistics(Long engineId);

	Map<String, ParticipantStatistics> getEngineStatistics(Long engineId, String year);

	List<String> getEngineYearsStatistics(Long engineId);

	void updateSeriesDriversChampions(SeriesEdition seriesEd);

	void updateSeriesDriversChampions(SeriesEdition seriesEd, List<Driver> currentChamps, List<Driver> newChamps, String category, String period);

	void updateSeriesTeamsChampions(SeriesEdition seriesEd, List<Team> currentChamps, List<Team> newChamps, String category, String period);
}

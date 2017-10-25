package com.icesoft.msdb.service;

import java.util.List;
import java.util.Map;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.stats.Statistics;

public interface StatisticsService {
	
	void deleteAllStatistics();
	
	void buildEventStatistics(Long eventEditionId);
	
	void buildEventStatistics(EventEdition eventEdition);
	
	void removeEventStatistics(Long eventEditionId);
	
	void removeEventStatistics(EventEdition event);
	
	void buildSeriesStatistics(SeriesEdition series);
	
	Map<String, Statistics> getDriverStatistics(Long driverId);
	
	Map<String, Statistics> getDriverStatistics(Long driverId, String year);
	
	List<String> getDriverYearsStatistics(Long driverId);
	
	Map<String, Statistics> getTeamStatistics(Long teamId);
	
	Map<String, Statistics> getTeamStatistics(Long teamId, String year);
	
	List<String> getTeamYearsStatistics(Long teamId);
	
	Map<String, Statistics> getChassisStatistics(Long chassisId);
	
	Map<String, Statistics> getChassisStatistics(Long chassisId, String year);
	
	List<String> getChassisYearsStatistics(Long chassisId);
	
	Map<String, Statistics> getEngineStatistics(Long engineId);
	
	Map<String, Statistics> getEngineStatistics(Long engineId, String year);
	
	List<String> getEngineYearsStatistics(Long engineId);
}

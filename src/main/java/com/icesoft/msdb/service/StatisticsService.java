package com.icesoft.msdb.service;

import java.util.List;
import java.util.Map;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.stats.Statistics;

public interface StatisticsService {

	void rebuildStatistics();
	
	void buildEventStatistics(Long eventEditionId);
	
	void buildEventStatistics(EventEdition eventEdition);
	
	Map<String, Statistics> getDriverStatistics(Long driverId);
	
	Map<String, Statistics> getDriverStatistics(Long driverId, Integer year);
	
	List<Integer> getDriverYearsStatistics(Long driverId);
	
	Map<String, Statistics> getTeamStatistics(Long teamId);
	
	Map<String, Statistics> getTeamStatistics(Long teamId, Integer year);
	
	List<Integer> getTeamYearsStatistics(Long teamId);
	
	Map<String, Statistics> getChassisStatistics(Long chassisId);
	
	Map<String, Statistics> getChassisStatistics(Long chassisId, Integer year);
	
	List<Integer> getChassisYearsStatistics(Long chassisId);
	
	Map<String, Statistics> getEngineStatistics(Long engineId);
	
	Map<String, Statistics> getEngineStatistics(Long engineId, Integer year);
	
	List<Integer> getEngineYearsStatistics(Long engineId);
}

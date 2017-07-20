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
	
	Map<String, Statistics> getTeamStatistics(Long driverId);
	
	Map<String, Statistics> getTeamStatistics(Long driverId, Integer year);
	
	List<Integer> getTeamYearsStatistics(Long driverId);
	
	Map<String, Statistics> getChassisStatistics(Long driverId);
	
	Map<String, Statistics> getChassisStatistics(Long driverId, Integer year);
	
	List<Integer> getChassisYearsStatistics(Long driverId);
	
	Map<String, Statistics> getEngineStatistics(Long driverId);
	
	Map<String, Statistics> getEngineStatistics(Long driverId, Integer year);
	
	List<Integer> getEngineYearsStatistics(Long driverId);
}

package com.icesoft.msdb.service;

import java.util.Map;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.stats.Statistics;

public interface StatisticsService {

	void rebuildStatistics();
	
	void buildEventStatistics(Long eventEditionId);
	
	void buildEventStatistics(EventEdition eventEdition);
	
	Map<String, Statistics> getDriverStatistics(Long driverId);
}

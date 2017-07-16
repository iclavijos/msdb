package com.icesoft.msdb.domain.stats;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class DriverStatistics {

	@Id
	private String driverId;
	private Map<String, Statistics> categoriesStats = new HashMap<>();
	
	public DriverStatistics(String driverId) {
		this.driverId = driverId;
	}
	
	public List<String> getCategories() {
		List<String> result = categoriesStats.entrySet().parallelStream()
				.map((entry) -> entry.getKey())
				.collect(Collectors.toList());
		
		result.sort((c1, c2) -> c1.compareTo(c2));
		return result;
	}
	
	public Statistics getStaticsForCategory(String categoryName) {
		Statistics result = categoriesStats.get(categoryName);
		
		if (result == null) {
			result = new Statistics();
		}
		return result;
	}
	
	@JsonIgnore
	public Map<String, Statistics> getDriverStatistics() {
		return categoriesStats;
	}
	
	public void updateStatistics(String categoryName, Statistics stats) {
		categoriesStats.put(categoryName, stats);
	}
}

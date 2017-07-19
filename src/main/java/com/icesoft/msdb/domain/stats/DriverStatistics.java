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
	private Map<Integer, Map<String, Statistics>> yearsCategoriesStats = new HashMap<>();
	
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
	
	public List<String> getCategories(Integer year) {
		List<String> result = yearsCategoriesStats.get(year).entrySet().parallelStream()
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
	
	public Statistics getStaticsForCategory(String categoryName, Integer year) {
		Map<String, Statistics> tmp = yearsCategoriesStats.get(year);
		if (tmp == null) {
			tmp = new HashMap<>();
			yearsCategoriesStats.put(year, tmp);
		}
		
		Statistics result = tmp.get(categoryName);
		if (result == null) {
			result = new Statistics();
		}
		return result;
	}
	
	public List<Integer> getYearsStatistics() {
		return yearsCategoriesStats.keySet().stream().sorted((y1, y2) -> y1.compareTo(y2)).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public Map<String, Statistics> getDriverStatistics() {
		return categoriesStats;
	}
	
	@JsonIgnore
	public Map<String, Statistics> getDriverStatisticsYear(Integer year) {
		return yearsCategoriesStats.get(year);
	}
	
	public void updateStatistics(String categoryName, Statistics stats) {
		categoriesStats.put(categoryName, stats);
	}
	
	public void updateStatistics(String categoryName, Statistics stats, Integer year) {
		Map<String, Statistics> catStats = yearsCategoriesStats.get(year);
		catStats.put(categoryName, stats);
		yearsCategoriesStats.put(year, catStats);
	}
}

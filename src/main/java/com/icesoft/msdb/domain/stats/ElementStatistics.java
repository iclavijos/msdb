package com.icesoft.msdb.domain.stats;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class ElementStatistics {

	private Map<String, Statistics> categoriesStats = new HashMap<>();
	private Map<Integer, Map<String, Statistics>> yearsCategoriesStats = new HashMap<>();
	
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
		return Optional.ofNullable(categoriesStats.get(categoryName)).orElse(new Statistics());
	}
	
	public Statistics getStaticsForCategory(String categoryName, Integer year) {
		Map<String, Statistics> tmp = yearsCategoriesStats.get(year);
		if (tmp == null) {
			tmp = new HashMap<>();
			yearsCategoriesStats.put(year, tmp);
		}
		
		return Optional.ofNullable(tmp.get(categoryName)).orElse(new Statistics());
	}
	
	public List<Integer> getYearsStatistics() {
		return yearsCategoriesStats.keySet().stream().sorted((y1, y2) -> y1.compareTo(y2)).collect(Collectors.toList());
	}
	
	public void removeStatisticsOfEvent(Long eventEditionId) {
		categoriesStats.forEach((category, catStats) -> {
			//catStats.removeResult(result);
		});
	}
	
	@JsonIgnore
	public Map<String, Statistics> getStatistics() {
		return categoriesStats;
	}
	
	@JsonIgnore
	public Map<String, Statistics> getStatisticsYear(Integer year) {
		return yearsCategoriesStats.get(year);
	}
	
	public void updateStatistics(String categoryName, Statistics stats) {
		categoriesStats.put(categoryName, stats);
	}
	
	public void updateStatistics(String categoryName, Statistics stats, Integer year) {
		Map<String, Statistics> catStats = 
				Optional.ofNullable(yearsCategoriesStats.get(year)).orElse(new HashMap<>());
		catStats.put(categoryName, stats);
		yearsCategoriesStats.put(year, catStats);
	}
}

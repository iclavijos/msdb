package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.stats.Statistics;

public class DriverStatsDTO {

	private String category;
	private Statistics stats;
	
	public DriverStatsDTO(String category, Statistics stats) {
		this.category = category;
		this.stats = stats;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Statistics getStats() {
		return stats;
	}

	public void setStats(Statistics stats) {
		this.stats = stats;
	}
}

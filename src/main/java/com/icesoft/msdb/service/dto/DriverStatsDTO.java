package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.stats.Statistics;

import lombok.Data;

@Data
public class DriverStatsDTO {

	private String category;
	private Statistics stats;
	
	public DriverStatsDTO(String category, Statistics stats) {
		this.category = category;
		this.stats = stats;
	}
}

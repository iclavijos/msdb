package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.stats.Statistics;
import lombok.Data;

@Data
public class StatsDTO {

	private String category;
	private Statistics stats;

	public StatsDTO(String category, Statistics stats) {
		this.category = category;
		this.stats = stats;
	}
}

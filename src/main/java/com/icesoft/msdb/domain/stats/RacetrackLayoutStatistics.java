package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="racetrackLayoutStatistics")
public class RacetrackLayoutStatistics extends ElementStatistics {

	@Id
	private String racetrackLayoutId;
	
	public RacetrackLayoutStatistics(String racetrackLayoutId) {
		this.racetrackLayoutId = racetrackLayoutId;
	}
}

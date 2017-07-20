package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="teamStatistics")
public class TeamStatistics extends ElementStatistics {

	@Id
	private String teamId;
	
	public TeamStatistics(String teamId) {
		this.teamId = teamId;
	}
}

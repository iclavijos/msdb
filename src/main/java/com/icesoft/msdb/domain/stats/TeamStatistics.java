package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="teamStatistics")
public class TeamStatistics extends ParticipantStatisticsSnapshot {

	@Id
	private String teamId;
	@Version
	private Long version;
	
	public TeamStatistics(String teamId) {
		this.teamId = teamId;
	}
}

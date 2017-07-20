package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="engineStatistics")
public class EngineStatistics extends ElementStatistics {

	@Id
	private String engineId;
	
	public EngineStatistics(String engineId) {
		this.engineId = engineId;
	}
}

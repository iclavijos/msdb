package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="chassisStatistics")
public class ChassisStatistics extends ElementStatistics {

	@Id
	private String chassisId;
	@Version
	private Long version;
	
	public ChassisStatistics(String chassisId) {
		this.chassisId = chassisId;
	}
}

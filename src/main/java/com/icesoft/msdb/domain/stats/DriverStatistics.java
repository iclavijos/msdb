package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="driverStatistics")
public class DriverStatistics extends ElementStatistics {

	@Id
	private String driverId;
	@Version
	private Long version;
	
	public DriverStatistics(String driverId) {
		this.driverId = driverId;
	}

}

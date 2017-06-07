package com.icesoft.msdb.service.dto;

public class DriverPointsDTO {

	private final Long driverId;
	private final String driverName;
	private final Float points;
	
	public DriverPointsDTO(Long driverId, String driverName, Float points) {
		super();
		this.driverId = driverId;
		this.driverName = driverName;
		this.points = points;
	}

	public Long getDriverId() {
		return driverId;
	}

	public String getDriverName() {
		return driverName;
	}

	public Float getPoints() {
		return points;
	}
	
}

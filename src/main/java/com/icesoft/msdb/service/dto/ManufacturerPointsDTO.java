package com.icesoft.msdb.service.dto;

public class ManufacturerPointsDTO {

	private final String manufacturerName;
	private final Float points;
	
	public ManufacturerPointsDTO(String manufacturerName, Float points) {
		super();
		this.manufacturerName = manufacturerName;
		this.points = points;
	}

	public String getManufacturerName() {
		return manufacturerName;
	}

	public Float getPoints() {
		return points;
	}
	
}

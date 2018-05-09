package com.icesoft.msdb.service.dto;

public class ManufacturerPointsDTO {

	private final String manufacturerName;
	private final Float points;
	private final String category;

	public ManufacturerPointsDTO(String manufacturerName, Float points, String category) {
		super();
		this.manufacturerName = manufacturerName;
		this.points = points;
		this.category = category;
	}

	public String getManufacturerName() {
		return manufacturerName;
	}

	public Float getPoints() {
		return points;
	}

	public String getCategory() { return category; }

}

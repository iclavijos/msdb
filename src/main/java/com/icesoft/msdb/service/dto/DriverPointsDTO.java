package com.icesoft.msdb.service.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.web.rest.views.ResponseViews;

public class DriverPointsDTO {

	@JsonView(ResponseViews.DriverPointsDetailView.class)
	private final Long id;
	private final Long driverId;
	@JsonView(ResponseViews.DriverPointsDetailView.class)
	private final String driverName;
	@JsonView(ResponseViews.DriverPointsDetailView.class)
	private final Float points;
	private final Integer numPoints;
	@JsonView(ResponseViews.DriverPointsDetailView.class)
	private final String reason;
	private final String category;

	public DriverPointsDTO(Long id, Long driverId, String driverName, Float points, String category) {
		this(id, driverId, driverName, points, 1, category, "");
	}

	public DriverPointsDTO(Long id, String driverName, Float points, String reason, String category) {
		this(id, null, driverName, points, 0, category, reason);
	}

	public DriverPointsDTO(Long id, Long driverId, String driverName, Float points, Integer numPoints, String category, String reason) {
		super();
		this.id = id;
		this.driverId = driverId;
		this.driverName = driverName;
		this.points = points;
		this.numPoints = numPoints;
		this.category = category;
		this.reason = reason;
	}

	public Long getId() {
		return id;
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

	public Integer getNumPoints() {
		return numPoints;
	}

	public String getReason() {
		return reason;
	}

	public String getCategory() { return category; }
}

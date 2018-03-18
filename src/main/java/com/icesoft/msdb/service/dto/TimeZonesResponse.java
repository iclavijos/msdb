package com.icesoft.msdb.service.dto;

import java.util.List;

import com.icesoft.msdb.domain.TimeZone;

public class TimeZonesResponse {
	private String status;
	private String message;
	private List<TimeZone> zones;

	public TimeZonesResponse() {
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<TimeZone> getZones() {
		return zones;
	}

	public void setZones(List<TimeZone> timezones) {
		this.zones = timezones;
	}
	
}
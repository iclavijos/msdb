package com.icesoft.msdb.service.dto;

import lombok.Data;

@Data
public class RacetrackWithLayoutsImportDTO {

	private String racetrackName;
	private String location;
	private String layoutName;
	private int length;
	private int yearFirstUse;
	private boolean active = false;

	public boolean isActive() {
		return active;
	}
}

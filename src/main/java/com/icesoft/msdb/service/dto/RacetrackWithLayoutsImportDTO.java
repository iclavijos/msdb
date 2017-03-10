package com.icesoft.msdb.service.dto;

public class RacetrackWithLayoutsImportDTO {

	private String racetrackName;
	private String location;
	private String layoutName;
	private int length;
	private int yearFirstUse;
	private boolean active = false;
	
	public String getRacetrackName() {
		return racetrackName;
	}
	public void setRacetrackName(String racetrackName) {
		this.racetrackName = racetrackName;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getLayoutName() {
		return layoutName;
	}
	public void setLayoutName(String layoutName) {
		this.layoutName = layoutName;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public int getYearFirstUse() {
		return yearFirstUse;
	}
	public void setYearFirstUse(int yearFirstUse) {
		this.yearFirstUse = yearFirstUse;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean active) {
		this.active = active;
	}
}

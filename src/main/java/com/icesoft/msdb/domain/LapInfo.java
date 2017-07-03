package com.icesoft.msdb.domain;

public class LapInfo {
	
	private String raceNumber;
	private String driverName;
	private Integer lapNumber;
	private Long lapTime;
	private Boolean pitstop;
	
	public LapInfo() {
		
	}
	
	public LapInfo(String raceNumber, String driverName, Integer lapNumber, Long lapTime, Boolean pitstop) {
		this.raceNumber = raceNumber;
		this.driverName = driverName;
		this.lapNumber = lapNumber;
		this.lapTime = lapTime;
		this.pitstop = pitstop;
	}

	public String getRaceNumber() {
		return raceNumber;
	}

	public Integer getLapNumber() {
		return lapNumber;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public Long getLapTime() {
		return lapTime;
	}

	public Boolean getPitstop() {
		return pitstop;
	}

	public void setRaceNumber(String raceNumber) {
		this.raceNumber = raceNumber;
	}

	public void setLapNumber(Integer lapNumber) {
		this.lapNumber = lapNumber;
	}

	public void setLapTime(Long lapTime) {
		this.lapTime = lapTime;
	}

	public void setPitstop(Boolean pitstop) {
		this.pitstop = pitstop;
	}

	@Override
	public String toString() {
		return "LapInfo [raceNumber=" + raceNumber + ", lapNumber=" + lapNumber + ", lapTime=" + lapTime
				+ ", pitstop=" + pitstop + "]";
	}
	
}

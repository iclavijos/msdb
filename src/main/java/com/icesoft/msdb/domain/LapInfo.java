package com.icesoft.msdb.domain;

import org.springframework.data.annotation.Id;

public class LapInfo {

	@Id
	private Long id;
	
	private String raceNumber;
	private Integer lapNumber;
	private Long lapTime;
	private Boolean pitstop;
	
	public LapInfo() {
		
	}
	
	public LapInfo(String raceNumber, Integer lapNumber, Long lapTime, Boolean pitstop) {
		this.raceNumber = raceNumber;
		this.lapNumber = lapNumber;
		this.lapTime = lapTime;
		this.pitstop = pitstop;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getId() {
		return id;
	}
	
	public String getRaceNumber() {
		return raceNumber;
	}

	public Integer getLapNumber() {
		return lapNumber;
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
		return "LapInfo [id=" + id + ", raceNumber=" + raceNumber + ", lapNumber=" + lapNumber + ", lapTime=" + lapTime
				+ ", pitstop=" + pitstop + "]";
	}
	
}

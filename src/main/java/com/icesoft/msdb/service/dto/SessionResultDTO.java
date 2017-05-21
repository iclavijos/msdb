package com.icesoft.msdb.service.dto;

public class SessionResultDTO {

	private String raceNumber;
	private Integer startingPosition;
	private String finalPosition;
    private String totalTime;
    private String bestLapTime;
    private Integer lapsCompleted;
    private Boolean retired;
    private String cause;
    private String difference;
    
	public String getRaceNumber() {
		return raceNumber;
	}
	public void setRaceNumber(String raceNumber) {
		this.raceNumber = raceNumber;
	}
	public Integer getStartingPosition() {
		return startingPosition;
	}
	public void setStartingPosition(Integer startingPosition) {
		this.startingPosition = startingPosition;
	}
	public String getFinalPosition() {
		return finalPosition;
	}
	public void setFinalPosition(String finalPosition) {
		this.finalPosition = finalPosition;
	}
	public String getTotalTime() {
		return totalTime;
	}
	public void setTotalTime(String totalTime) {
		this.totalTime = totalTime;
	}
	public String getBestLapTime() {
		return bestLapTime;
	}
	public void setBestLapTime(String bestLapTime) {
		this.bestLapTime = bestLapTime;
	}
	public Integer getLapsCompleted() {
		return lapsCompleted;
	}
	public void setLapsCompleted(Integer lapsCompleted) {
		this.lapsCompleted = lapsCompleted;
	}
	public Boolean getRetired() {
		return retired;
	}
	public void setRetired(Boolean retired) {
		this.retired = retired;
	}
	public String getCause() {
		return cause;
	}
	public void setCause(String cause) {
		this.cause = cause;
	}
	public String getDifference() {
		return difference;
	}
	public void setDifference(String difference) {
		this.difference = difference;
	}
    
}

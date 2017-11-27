package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;

public class SessionResultDTO {

	private Long id;
	private String raceNumber;
	private Integer startingPosition;
	private String finalPosition;
    private String totalTime;
    private String bestLapTime;
    private Integer lapsCompleted;
    private Integer lapsLed;
    private Boolean retired;
    private String cause;
    private String difference;
    private Boolean pitlaneStart;
    private String sharedWithNumber;
    private EventEditionEntry entry;
    
    public SessionResultDTO() {
    	super();
    }
    
    public SessionResultDTO(EventEntryResult result) {
    	this.id = result.getId();
    	this.raceNumber = result.getEntry().getRaceNumber();
    	this.startingPosition = result.getStartingPosition();
    	this.finalPosition = result.getFinalPosition().toString();
    	this.totalTime = result.getTotalTime() != null ? result.getTotalTime().toString() : "";
    	this.bestLapTime = result.getBestLapTime() != null ? result.getBestLapTime().toString() : "";
    	this.lapsCompleted = result.getLapsCompleted();
    	this.lapsLed = result.getLapsLed();
    	this.retired = result.isRetired();
    	this.cause = result.getCause();
    	this.difference = result.getDifference() != null ? result.getDifference().toString() : "";
    	this.pitlaneStart = result.isPitlaneStart();
    	this.sharedWithNumber = result.getSharedDriveWith() != null ? result.getSharedDriveWith().getRaceNumber() : "";
    	this.entry = result.getEntry();
    	this.entry.setEventEdition(null);
    	this.entry.engine(null).chassis(null).tyres(null).fuel(null).team(null);
    }
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getRaceNumber() {
		return raceNumber;
	}
	public void setRaceNumber(String raceNumber) {
		this.raceNumber = raceNumber;
	}
	public EventEditionEntry getEntry() {
		return entry;
	}

	public void setEntry(EventEditionEntry entry) {
		this.entry = entry;
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
	public Integer getLapsLed() {
		return lapsLed;
	}
	public void setLapsLed(Integer lapsLed) {
		this.lapsLed = lapsLed;
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
	public Boolean getPitlaneStart() {
		return pitlaneStart;
	}
	public void setPitlaneStart(Boolean pitlaneStart) {
		this.pitlaneStart = pitlaneStart;
	}
	public String getSharedWithNumber() {
		return sharedWithNumber;
	}
	public void setSharedWithNumber(String sharedWithNumber) {
		this.sharedWithNumber = sharedWithNumber;
	}
    
}

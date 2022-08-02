package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

@NoArgsConstructor
@Data
public class SessionResultDTO {

	private Long id;
	private String raceNumber;
	private Integer startingPosition;
	private Integer finalPosition;
	@JsonIgnore
	private String finalPositionStr;
    private String totalTime;
    private String bestLapTime;
    private Integer lapsCompleted;
    private Integer lapsLed;
    private Boolean retired;
    private String cause;
    private String difference;
    private Integer differenceType;
    private Boolean pitlaneStart;
    private String sharedWithNumber;
    private EventEditionEntry sharedWith;
    private EventEditionEntry entry;

    public SessionResultDTO(EventEntryResult result) {
    	this.id = result.getId();
    	this.raceNumber = result.getEntry().getRaceNumber();
    	this.startingPosition = result.getStartingPosition();
    	this.finalPosition = result.getFinalPosition();
    	this.totalTime = result.getTotalTime() != null ? result.getTotalTime().toString() : "";
    	this.bestLapTime = result.getBestLapTime() != null ? result.getBestLapTime().toString() : "";
    	this.lapsCompleted = result.getLapsCompleted();
    	this.lapsLed = result.getLapsLed();
    	this.retired = result.isRetired();
    	this.cause = result.getCause();
    	this.difference = result.getDifference() != null ? result.getDifference().toString() : "";
    	this.pitlaneStart = result.isPitlaneStart();
    	this.sharedWith = result.getSharedWith();
    	this.sharedWithNumber = result.getSharedWith() != null ? result.getSharedWith().getRaceNumber() : "";
    	this.differenceType = result.getDifferenceType();
    	this.entry = result.getEntry();
    	this.entry.setEventEdition(null);
    	this.entry.setEngine(null);
        this.entry.setChassis(null);
        this.entry.setFuel(null);
        this.entry.setTeam(null);
    }

	public void setFinalPosition(String finalPosition) {
        try {
            this.finalPosition = Integer.parseInt(finalPosition);
        } catch (NumberFormatException e) {
        } finally {
            this.finalPositionStr = finalPosition;
        }
    }

}

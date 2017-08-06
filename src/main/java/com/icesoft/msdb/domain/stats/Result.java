package com.icesoft.msdb.domain.stats;

import java.time.LocalDate;

import org.springframework.data.annotation.Transient;

import com.icesoft.msdb.domain.EventEntryResult;

public class Result {

	@Transient
	EventEntryResult entryResult;
	Long eventEditionId;
	Long entryId;
	Integer order;
	String eventName;
	String sessionName;
	Boolean multidriver;
	Integer year;
	LocalDate eventDate;
	Integer position;
	Integer gridPosition;
	Integer lapsLed;
	Integer lapsCompleted;
	Integer lapLength;
	Boolean retired;
	String retirementCause;
	Boolean grandChelem;
	Boolean pitlaneStart;
	Boolean raceFastLap;
	Long poleLapTime;
	Long raceFastLapTime;
	Float points;
	
	public Result() {
		super();
	}
	
	public Result(EventEntryResult result, Boolean grandChelem, Integer finalPosition, Integer gridPosition, Long poleLapTime, Boolean raceFastLap, Float points) {
		this.entryResult = result;
		this.multidriver = result.getEntry().getEventEdition().isMultidriver();
		this.setEventDate(result.getSession().getSessionStartTime().toLocalDate());
		this.setEventEditionId(result.getEntry().getEventEdition().getId());
		this.setEntryId(result.getEntry().getId());
		this.setEventName(result.getEntry().getEventEdition().getLongEventName());
		this.setSessionName(result.getSession().getName());
		this.setGrandChelem(grandChelem);
		if (gridPosition != -1) {
			this.setGridPosition(gridPosition);
		}
		this.setLapsLed(result.getLapsLed());
		this.setLapsCompleted(result.getLapsCompleted());
		this.setLapLength(result.getEntry().getEventEdition().getTrackLayout().getLength());
		this.setPosition(finalPosition);
		this.setRetired(result.isRetired());
		this.setYear(result.getEntry().getEventEdition().getEditionYear());
		this.setPitlaneStart(result.isPitlaneStart());
		this.setRetirementCause(result.getCause());
		this.setPoleLapTime(poleLapTime);
		this.setRaceFastLapTime(result.getBestLapTime());
		this.setRaceFastLap(raceFastLap);
		this.points = points;
	}
	
	public EventEntryResult getEntryResult() {
		return entryResult;
	}
	
	public Long getEventEditionId() {
		return eventEditionId;
	}
	public void setEventEditionId(Long eventEditionId) {
		this.eventEditionId = eventEditionId;
	}
	public Long getEntryId() {
		return entryId;
	}
	public void setEntryId(Long entryId) {
		this.entryId = entryId;
	}
	public Integer getOrder() {
		return order;
	}
	public void setOrder(Integer order) {
		this.order = order;
	}
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	public String getSessionName() {
		return sessionName;
	}
	public void setSessionName(String sessionName) {
		this.sessionName = sessionName;
	}
	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public LocalDate getEventDate() {
		return eventDate;
	}
	public void setEventDate(LocalDate eventDate) {
		this.eventDate = eventDate;
	}
	public Integer getPosition() {
		return position;
	}
	public void setPosition(Integer position) {
		this.position = position;
	}
	public Integer getGridPosition() {
		return gridPosition;
	}
	public void setGridPosition(Integer gridPosition) {
		this.gridPosition = gridPosition;
	}
	public Integer getLapsLed() {
		return lapsLed;
	}
	public void setLapsLed(Integer lapsLed) {
		this.lapsLed = lapsLed;
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
	public Boolean getGrandChelem() {
		return grandChelem;
	}
	public void setGrandChelem(Boolean grandChelem) {
		this.grandChelem = grandChelem;
	}
	public Boolean getPitlaneStart() {
		return pitlaneStart;
	}
	public void setPitlaneStart(Boolean pitlaneStart) {
		this.pitlaneStart = pitlaneStart;
	}	
	public String getRetirementCause() {
		return retirementCause;
	}
	public void setRetirementCause(String retirementCause) {
		this.retirementCause = retirementCause;
	}
	public Long getPoleLapTime() {
		return poleLapTime;
	}
	public void setPoleLapTime(Long poleLapTime) {
		this.poleLapTime = poleLapTime;
	}
	public Long getRaceFastLapTime() {
		return raceFastLapTime;
	}
	public void setRaceFastLapTime(Long raceFastLapTime) {
		this.raceFastLapTime = raceFastLapTime;
	}	
	public Boolean getRaceFastLap() {
		return raceFastLap;
	}
	public void setRaceFastLap(Boolean raceFastLap) {
		this.raceFastLap = raceFastLap;
	}
	public Boolean isMultidriver() {
		return multidriver;
	}
	public void setMultidriver(Boolean multidriver) {
		this.multidriver = multidriver;
	}
	public Integer getLapLength() {
		return lapLength;
	}
	public void setLapLength(Integer lapLength) {
		this.lapLength = lapLength;
	}
	public Float getPoints() {
		return points;
	}
	public void setPoints(Float points) {
		this.points = points;
	}

	@Override
	public String toString() {
		return "Result [eventEditionId=" + eventEditionId + ", entryId=" + entryId + ", eventName=" + eventName
				+ ", year=" + year + ", eventDate=" + eventDate + ", position=" + position + ", gridPosition="
				+ gridPosition + ", lapsLed=" + lapsLed + ", lapsCompleted=" + lapsCompleted + ", retired=" + retired
				+ ", grandChelem=" + grandChelem + ", pitlaneStart=" + pitlaneStart + "]";
	}
}

package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class EventEditionImportDTO {

	private String seriesEditionName;
	private String eventName;
	private String longEventEditionName;
	private String shortEventName;
	@JsonFormat(pattern="dd/MM/yyyy")
	private LocalDate eventDate;
	private String racetrackName;
	private String layoutName;
	private String categories;
	private Boolean multipleDriversEntry;
	private String sessionName;
	private String sessionShortName;
	@JsonFormat(pattern="dd/MM/yyyy HH:mm", timezone="UTC")
	private LocalDateTime sessionStartTime;
	private Integer sessionDuration;
	private String durationType;
	private Boolean extraLap;
	private String sessionType;
	private Integer maxDuration;
	private String pointsSystem;
	
	public String getSeriesEditionName() {
		return seriesEditionName;
	}
	public void setSeriesEditionName(String seriesEditionName) {
		this.seriesEditionName = seriesEditionName;
	}
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	public String getLongEventEditionName() {
		return longEventEditionName;
	}
	public void setLongEventEditionName(String longEventEditionName) {
		this.longEventEditionName = longEventEditionName;
	}
	public String getShortEventName() {
		return shortEventName;
	}
	public void setShortEventName(String shortEventName) {
		this.shortEventName = shortEventName;
	}
	public LocalDate getEventDate() {
		return eventDate;
	}
	public void setEventDate(LocalDate eventDate) {
		this.eventDate = eventDate;
	}
	public String getRacetrackName() {
		return racetrackName;
	}
	public void setRacetrackName(String racetrackName) {
		this.racetrackName = racetrackName;
	}
	public String getLayoutName() {
		return layoutName;
	}
	public void setLayoutName(String layoutName) {
		this.layoutName = layoutName;
	}
	public String getCategories() {
		return categories;
	}
	public void setCategories(String categories) {
		this.categories = categories;
	}
	public Boolean getMultipleDriversEntry() {
		return multipleDriversEntry;
	}
	public void setMultipleDriversEntry(Boolean multipleDriversEntry) {
		this.multipleDriversEntry = multipleDriversEntry;
	}
	public String getSessionName() {
		return sessionName;
	}
	public void setSessionName(String sessionName) {
		this.sessionName = sessionName;
	}
	public String getSessionShortName() {
		return sessionShortName;
	}
	public void setSessionShortName(String sessionShortName) {
		this.sessionShortName = sessionShortName;
	}
	public LocalDateTime getSessionStartTime() {
		return sessionStartTime;
	}
	public void setSessionStartTime(LocalDateTime sessionStartTime) {
		this.sessionStartTime = sessionStartTime;
	}
	public Integer getSessionDuration() {
		return sessionDuration;
	}
	public void setSessionDuration(Integer sessionDuration) {
		this.sessionDuration = sessionDuration;
	}
	public String getDurationType() {
		return durationType;
	}
	public void setDurationType(String durationType) {
		this.durationType = durationType;
	}
	public Boolean getExtraLap() {
		return extraLap;
	}
	public void setExtraLap(Boolean extraLap) {
		this.extraLap = extraLap;
	}
	public String getSessionType() {
		return sessionType;
	}
	public void setSessionType(String sessionType) {
		this.sessionType = sessionType;
	}
	public Integer getMaxDuration() {
		return maxDuration;
	}
	public void setMaxDuration(Integer maxDuration) {
		this.maxDuration = maxDuration;
	}	
	public String getPointsSystem() {
		return pointsSystem;
	}
	public void setPointsSystem(String pointsSystem) {
		this.pointsSystem = pointsSystem;
	}
	
	@Override
	public String toString() {
		return "EventEditionImportDTO [eventName=" + eventName + ", longEventEditionName=" + longEventEditionName
				+ ", shortEventName=" + shortEventName + ", eventDate=" + eventDate + ", racetrackName=" + racetrackName
				+ ", layoutName=" + layoutName + ", categories=" + categories + ", multipleDriversEntry="
				+ multipleDriversEntry + ", sessionName=" + sessionName + ", sessionShortName=" + sessionShortName
				+ ", sessionStartTime=" + sessionStartTime + ", sessionDuration=" + sessionDuration + ", durationType="
				+ durationType + ", extraLap=" + extraLap + ", sessionType=" + sessionType + ", maxDuration="
				+ maxDuration + "]";
	}
	
}

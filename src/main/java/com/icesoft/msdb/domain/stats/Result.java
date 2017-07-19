package com.icesoft.msdb.domain.stats;

import java.time.LocalDate;

public class Result {

	Integer order;
	Long eventEditionId;
	String eventName;
	Integer year;
	LocalDate eventDate;
	Integer position;
	Integer gridPosition;
	Integer lapsLed;
	Integer lapsCompleted;
	Boolean retired;
	Boolean grandChelem;
	Boolean pitlaneStart;
	
	public Integer getOrder() {
		return order;
	}
	public void setOrder(Integer order) {
		this.order = order;
	}
	public Long getEventEditionId() {
		return eventEditionId;
	}
	public void setEventEditionId(Long eventEditionId) {
		this.eventEditionId = eventEditionId;
	}
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
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
}

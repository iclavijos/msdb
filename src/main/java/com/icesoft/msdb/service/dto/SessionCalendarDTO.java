package com.icesoft.msdb.service.dto;

import java.time.ZonedDateTime;

public class SessionCalendarDTO {

	private final Long id;
	private final String eventName;
	private final String sessionName;
	private final ZonedDateTime startTime;
	private final ZonedDateTime endTime;
	
	
	public SessionCalendarDTO(Long id, String eventName, String sessionName, ZonedDateTime startTime, ZonedDateTime endTime) {
		this.id = id;
		this.eventName = eventName;
		this.sessionName = sessionName;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public Long getId() {
		return id;
	}

	public String getEventName() {
		return eventName;
	}

	public String getSessionName() {
		return sessionName;
	}
	
	public ZonedDateTime getStartTime() {
		return startTime;
	}

	public ZonedDateTime getEndTime() {
		return endTime;
	}
	
}

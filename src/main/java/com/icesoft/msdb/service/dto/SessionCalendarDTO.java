package com.icesoft.msdb.service.dto;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public class SessionCalendarDTO {

	private final Long id;
	private final String eventName;
	private final String sessionName;
	private final int sessionType;
	private final ZonedDateTime startTime;
	private final ZonedDateTime endTime;
	private final String[] seriesLogoUrl;
	private final String status;


	public SessionCalendarDTO(Long id, String eventName, String sessionName, int sessionType, ZonedDateTime startTime, ZonedDateTime endTime, String status, String... seriesLogoUrl) {
		this.id = id;
		this.eventName = eventName;
		this.sessionName = sessionName;
		this.sessionType = sessionType;
		this.startTime = startTime;
		this.endTime = endTime;
		this.seriesLogoUrl = seriesLogoUrl;
		this.status = status;
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

	public int getSessionType() {
		return sessionType;
	}

	public ZonedDateTime getStartTime() {
		return startTime;
	}

	public ZonedDateTime getEndTime() {
		return endTime;
	}

	public String[] getSeriesLogoUrl() {
		return seriesLogoUrl;
	}

    public String getStatus() {
        return status;
    }
}

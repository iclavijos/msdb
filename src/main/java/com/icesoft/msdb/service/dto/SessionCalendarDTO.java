package com.icesoft.msdb.service.dto;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public class SessionCalendarDTO {

	private final Long id;
	private final String seriesName;
	private final String eventName;
	private final String sessionName;
	private final int sessionType;
	private final ZonedDateTime startTime;
	private final ZonedDateTime endTime;
	private final String[] seriesLogoUrl;
	private final String status;
    private final Integer seriesRelevance;
    private final String racetrack;
    private final String racetrackLayoutUrl;

	public SessionCalendarDTO(
	    Long id, String seriesName, String eventName, String sessionName, int sessionType,
        ZonedDateTime startTime, ZonedDateTime endTime, String status, Integer seriesRelevance,
        String racetrack, String racetrackLayoutUrl,
        String... seriesLogoUrl) {
		this.id = id;
		this.seriesName = seriesName;
		this.eventName = eventName;
		this.sessionName = sessionName;
		this.sessionType = sessionType;
		this.startTime = startTime;
		this.endTime = endTime;
		this.seriesLogoUrl = seriesLogoUrl;
		this.status = status;
		this.seriesRelevance = seriesRelevance;
		this.racetrack = racetrack;
		this.racetrackLayoutUrl = racetrackLayoutUrl;
	}

	public Long getId() {
		return id;
	}

	public String getSeriesName() { return seriesName; }

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

    public Integer getSeriesRelevance() { return seriesRelevance; }

    public String getRacetrack() { return racetrack; }

    public String getRacetrackLayoutUrl() { return racetrackLayoutUrl; }
}

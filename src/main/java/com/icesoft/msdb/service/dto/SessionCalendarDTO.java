package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.enums.SessionType;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SessionCalendarDTO {

    private final Long eventEditionId;
    private final Long eventId;
	private final String seriesName;
	private final String eventName;
	private final String sessionName;
    private final Boolean cancelled;
	private final SessionType sessionType;
	private final ZonedDateTime startTime;
	private final ZonedDateTime endTime;
    private final Float duration;
    private final Float totalDuration;
	private final String[] seriesLogoUrl;
	private final String[] categories;
	private final String status;
    private final Integer seriesRelevance;
    private final String racetrack;
    private final String racetrackLayoutUrl;
    private final Boolean rally;
    private final Boolean raid;

	public SessionCalendarDTO(
	    Long eventEditionId, Long eventId, String seriesName, String eventName, String sessionName, Boolean cancelled, SessionType sessionType,
        ZonedDateTime startTime, ZonedDateTime endTime, Float duration, Float totalDuration, String status, Integer seriesRelevance,
        String racetrack, String racetrackLayoutUrl, String[] categories, Boolean rally, Boolean raid,
        String... seriesLogoUrl) {
        this.eventEditionId = eventEditionId;
        this.eventId = eventId;
		this.seriesName = seriesName;
		this.eventName = eventName;
		this.sessionName = sessionName;
        this.cancelled = cancelled;
		this.sessionType = sessionType;
		this.startTime = startTime;
		this.endTime = endTime;
        this.duration = duration;
        this.totalDuration = totalDuration;
		this.seriesLogoUrl = seriesLogoUrl;
		this.status = status;
		this.seriesRelevance = seriesRelevance;
		this.racetrack = racetrack;
		this.racetrackLayoutUrl = racetrackLayoutUrl;
		this.categories = categories;
        this.rally = rally;
        this.raid = raid;
	}

}

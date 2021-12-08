package com.icesoft.msdb.service.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SessionCalendarDTO {

	private final Long id;
	private final String seriesName;
	private final String eventName;
	private final String sessionName;
	private final int sessionType;
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
	    Long id, String seriesName, String eventName, String sessionName, int sessionType,
        ZonedDateTime startTime, ZonedDateTime endTime, Float duration, Float totalDuration, String status, Integer seriesRelevance,
        String racetrack, String racetrackLayoutUrl, String[] categories, Boolean rally, Boolean raid,
        String... seriesLogoUrl) {
		this.id = id;
		this.seriesName = seriesName;
		this.eventName = eventName;
		this.sessionName = sessionName;
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

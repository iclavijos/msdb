package com.icesoft.msdb.service.dto;

import java.time.ZonedDateTime;
import java.util.List;

import com.icesoft.msdb.domain.EventSession;

public class SessionDataDTO {
	private final String sessionName;
	private final ZonedDateTime sessionStartTime;
	private final ZonedDateTime sessionEndTime;
	private final Integer duration;
	private final Integer durationType;
	private final Long eventEditionId;
	private final String eventName;
	private final List<Long> seriesIds;
	private final List<String> seriesNames;
	
	public SessionDataDTO(EventSession session) {
		this.sessionName = session.getName();
		this.sessionStartTime = session.getSessionStartTime();
		this.sessionEndTime = session.getSessionEndTime();
		this.duration = session.getDuration();
		this.durationType = session.getDurationType();
		this.eventEditionId = session.getEventEdition().getId();
		this.eventName = session.getEventEdition().getLongEventName();
		this.seriesIds = session.getSeriesIds();
		this.seriesNames = session.getSeriesNames();
	}
	
	public ZonedDateTime getSessionStartTime() {
		return sessionStartTime;
	}

	public String getSessionName() {
		return sessionName;
	}

	public ZonedDateTime getSessionEndTime() {
		return sessionEndTime;
	}

	public Integer getDuration() {
		return duration;
	}

	public Integer getDurationType() {
		return durationType;
	}

	public Long getEventEditionId() {
		return eventEditionId;
	}

	public String getEventName() {
		return eventName;
	}

	public List<Long> getSeriesIds() {
		return seriesIds;
	}

	public List<String> getSeriesNames() {
		return seriesNames;
	}
}

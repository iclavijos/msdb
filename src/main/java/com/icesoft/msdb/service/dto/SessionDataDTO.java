package com.icesoft.msdb.service.dto;

import java.time.ZonedDateTime;
import java.util.List;

import com.icesoft.msdb.domain.EventSession;
import lombok.Data;

@Data
public class SessionDataDTO {
	private final String sessionName;
	private final ZonedDateTime sessionStartTime;
	private final ZonedDateTime sessionEndTime;
	private final Integer duration;
	private final Integer durationType;
	private final Long eventEditionId;
	private final String eventName;
	private final String racetrack;
	private final List<Long> seriesIds;
	private final List<String> seriesNames;

	public SessionDataDTO(EventSession session) {
		this.sessionName = session.getName();
		this.sessionStartTime = session.getSessionStartTimeDate();
		this.sessionEndTime = session.getSessionEndTime();
		this.duration = session.getDuration();
		this.durationType = session.getDurationType();
		this.eventEditionId = session.getEventEdition().getId();
		this.eventName = session.getEventEdition().getLongEventName();
		this.seriesIds = session.getSeriesIds();
		this.seriesNames = session.getSeriesNames();
		this.racetrack = session.getEventEdition().getTrackLayout().getRacetrack().getName();
	}

}

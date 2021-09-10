package com.icesoft.msdb.service.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.icesoft.msdb.domain.EventSession;
import lombok.Data;

@Data
public class SessionDataDTO {
	private final String sessionName;
	private final ZonedDateTime sessionStartTime;
	private final ZonedDateTime sessionEndTime;
	private final Integer duration;
	private final Integer durationType;
    private final String sessionType;
	private final Long eventEditionId;
	private final String eventName;
	private final String racetrack;
	private final List<Long> seriesIds;
	private final List<String> seriesNames;
	private final String seriesLogo;

	public SessionDataDTO(EventSession session) {
		this.sessionName = session.getName();
		this.sessionStartTime = session.getSessionStartTimeDate();
		this.sessionEndTime = session.getSessionEndTime();
		this.duration = session.getDuration();
		this.durationType = session.getDurationType();
        this.sessionType = session.getSessionType().name();
		this.eventEditionId = session.getEventEdition().getId();
		this.eventName = session.getEventEdition().getLongEventName();
		this.seriesIds = session.getSeriesIds();
		this.seriesNames = session.getSeriesNames();
		this.racetrack = session.getEventEdition().getTrackLayout().getRacetrack().getName();
		Optional<String> seriesLogo = Optional.ofNullable(session.getEventEdition().getSeriesEditions().stream()
            .map(series -> Optional.ofNullable(series.getLogoUrl()).orElse(
                series.getSeries().getLogoUrl()
            )).findFirst().orElse(null));

		this.seriesLogo = seriesLogo.orElse(
		    Optional.ofNullable(session.getEventEdition().getPosterUrl()).orElse(null));
	}

}

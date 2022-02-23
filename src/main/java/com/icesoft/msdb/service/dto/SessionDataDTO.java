package com.icesoft.msdb.service.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import com.icesoft.msdb.domain.EventSession;
import lombok.Data;

@Data
public class SessionDataDTO {
	private final String sessionName;
	private final ZonedDateTime sessionStartTime;
	private final ZonedDateTime sessionEndTime;
	private final Float duration;
    private final Float totalDuration;
	private final Integer durationType;
    private final String sessionType;
	private final Long eventEditionId;
	private final String eventName;
	private final String racetrack;
	private final List<Long> seriesIds;
	private final List<String> seriesNames;
	private final String seriesLogo;
    private final Boolean rally;
    private final Boolean raid;
    private final Boolean cancelled;

	public SessionDataDTO(EventSession session) {
		this.sessionName =
            session.getEventEdition().getEvent().isRally() ||
                session.getEventEdition().getEvent().isRaid() ?
                    String.format("%s - %s", session.getShortname(), session.getName()) :
                    session.getName();
		this.sessionStartTime = session.getSessionStartTimeDate();
		this.sessionEndTime = session.getSessionEndTime();
		this.duration = session.getDuration();
        this.totalDuration = session.getTotalDuration();
		this.durationType = session.getDurationType();
        this.sessionType = session.getSessionType().name();
		this.eventEditionId = session.getEventEdition().getId();
		this.eventName = session.getEventEdition().getLongEventName();
		this.seriesIds = session.getSeriesIds();
		this.seriesNames = session.getSeriesNames();
		this.racetrack = Optional.ofNullable(session.getEventEdition().getTrackLayout())
            .map(trackLayout -> trackLayout.getRacetrack().getName())
            .orElse(null);
		Optional<String> seriesLogo = Optional.ofNullable(session.getEventEdition().getSeriesEditions().stream()
            .map(series -> Optional.ofNullable(series.getLogoUrl()).orElse(
                series.getSeries().getLogoUrl()
            )).findFirst().orElse(null));

		this.seriesLogo = seriesLogo.orElse(
		    Optional.ofNullable(session.getEventEdition().getPosterUrl()).orElse(null));

        this.rally = session.getEventEdition().getEvent().isRally();
        this.raid = session.getEventEdition().getEvent().isRaid();
        this.cancelled = session.getCancelled();
	}

}

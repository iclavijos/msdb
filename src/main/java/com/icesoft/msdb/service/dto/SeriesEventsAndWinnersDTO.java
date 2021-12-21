package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.domain.enums.EventStatusType;

public class SeriesEventsAndWinnersDTO {

	private final EventEdition eventEdition;
	private final List<SessionWinnersDTO> winners;

	public SeriesEventsAndWinnersDTO(EventEdition eventEdition, List<SessionWinnersDTO> winners) {
		this.eventEdition = eventEdition;
		this.winners = winners;
	}

    public EventEdition getEventEdition() { return eventEdition; }

	public List<SessionWinnersDTO> getWinners() {
		return winners;
	}

	public String getEventEditionPosterUrl() { return eventEdition.getPosterUrl(); }

	public String getRacetrackLogoUrl() {
        return Optional.ofNullable(eventEdition.getTrackLayout())
            .map(trackLayout -> trackLayout.getRacetrack().getLogoUrl())
            .orElse(null);
    }

    public String getRacetrackLayoutUrl() {
        return Optional.ofNullable(eventEdition.getTrackLayout())
            .map(trackLayout -> trackLayout.getLayoutImageUrl())
            .orElse(null);
    }
}

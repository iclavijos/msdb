package com.icesoft.msdb.service.dto;

import java.util.List;
import java.util.Optional;

import com.icesoft.msdb.domain.EventEdition;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SeriesEventsAndWinnersDTO {

	private final EventEdition eventEdition;
	private final List<SessionWinnersDTO> winners;

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

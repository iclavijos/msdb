package com.icesoft.msdb.service.dto;

import java.util.List;
import java.util.Optional;

import com.icesoft.msdb.domain.EventEdition;
import lombok.Getter;

@Getter
public class SeriesEventsAndWinnersDTO {

	private final EventEdition eventEdition;
	private final List<SessionWinnersDTO> winners;

    private final String eventEditionPosterUrl;
    private final String racetrackLogoUrl;
    private final String racetrackLayoutUrl;

    public SeriesEventsAndWinnersDTO(EventEdition eventEdition, List<SessionWinnersDTO> winners) {
        this.winners = winners;
        this.eventEditionPosterUrl = eventEdition.getPosterUrl();
        this.racetrackLogoUrl = Optional.ofNullable(eventEdition.getTrackLayout())
            .map(trackLayout -> trackLayout.getRacetrack().getLogoUrl())
            .orElse(null);
        this.racetrackLayoutUrl = Optional.ofNullable(eventEdition.getTrackLayout())
            .map(trackLayout -> trackLayout.getLayoutImageUrl())
            .orElse(null);

        this.eventEdition = EventEdition.builder()
            .allowedCategories(eventEdition.getAllowedCategories())
            .eventDate(eventEdition.getEventDate())
            .id(eventEdition.getId())
            .longEventName(eventEdition.getLongEventName())
            .status(eventEdition.getStatus())
            .build();
    }

}

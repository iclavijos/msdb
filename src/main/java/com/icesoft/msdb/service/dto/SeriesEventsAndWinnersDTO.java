package com.icesoft.msdb.service.dto;

import java.util.List;
import java.util.Optional;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import lombok.Getter;

@Getter
public class SeriesEventsAndWinnersDTO {

	private final EventEdition eventEdition;
	private final List<SessionWinnersDTO> winners;

    public SeriesEventsAndWinnersDTO(EventEdition eventEdition, List<SessionWinnersDTO> winners) {
        this.winners = winners;

        Event trimmedEvent = Event.builder()
            .id(eventEdition.getEvent().getId())
            .rally(eventEdition.getEvent().isRally())
            .raid(eventEdition.getEvent().isRaid())
            .build();

        this.eventEdition = EventEdition.builder()
            .id(eventEdition.getId())
            .allowedCategories(eventEdition.getAllowedCategories())
            .event(trimmedEvent)
            .eventDate(eventEdition.getEventDate())
            .longEventName(eventEdition.getLongEventName())
            .posterUrl(eventEdition.getPosterUrl())
            .status(eventEdition.getStatus())
            .trackLayout(eventEdition.getTrackLayout())
            .build();

        if (trimmedEvent.isRally() || trimmedEvent.isRaid()) {
            this.eventEdition.setLatitude(eventEdition.getLatitude());
            this.eventEdition.setLongitude(eventEdition.getLongitude());
        }
    }

}

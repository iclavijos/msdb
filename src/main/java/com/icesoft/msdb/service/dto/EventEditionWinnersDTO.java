package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEdition;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class EventEditionWinnersDTO {

    private final EventEdition eventEdition;
    private final List<SessionWinnersDTO> sessionsWinners;

    public EventEditionWinnersDTO(EventEdition eventEdition) {
        this.eventEdition = eventEdition;
        this.sessionsWinners = new ArrayList<>();
    }

    public void addSessionWinners(SessionWinnersDTO winnersDTO) {
        this.sessionsWinners.add(winnersDTO);
    }
}

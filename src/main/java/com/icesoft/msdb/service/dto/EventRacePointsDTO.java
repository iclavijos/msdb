package com.icesoft.msdb.service.dto;

import lombok.Data;

@Data
public class EventRacePointsDTO {

	private Long raceId;
	private Long pSystemAssigned;
	private Float psMultiplier;

    public boolean isAssigned() {
        return pSystemAssigned != null;
    }
}

package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;
import lombok.Data;

@Data
public class LapsInfoDriversDTO {
    private String driversNames;
    private String raceNumber;

    public LapsInfoDriversDTO(EventEditionEntry entry) {
        this.driversNames = entry.getDriversName();
        this.raceNumber = entry.getRaceNumber();
    }

    public LapsInfoDriversDTO(String raceNumber, String driversNames) {
        this.raceNumber = raceNumber;
        this.driversNames = driversNames;
    }
}

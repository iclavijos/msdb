package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;

public class LapsInfoDriversDTO {
    private String driversNames;
    private String raceNumber;

    public LapsInfoDriversDTO(EventEditionEntry entry) {
        this.driversNames = entry.getDriversName();
        this.raceNumber = entry.getRaceNumber();
    }

    public String getDriversNames() {
        return driversNames;
    }

    public void setDriversNames(String driversNames) {
        this.driversNames = driversNames;
    }

    public String getRaceNumber() {
        return raceNumber;
    }

    public void setRaceNumber(String raceNumber) {
        this.raceNumber = raceNumber;
    }
}

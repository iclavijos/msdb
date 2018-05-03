package com.icesoft.msdb.service.dto;

import java.util.List;

public class RacePositionsDTO {

    private Integer lapNumber;
    private List<String> raceNumbers;

    public RacePositionsDTO(Integer lapNumber, List<String> raceNumbers) {
        this.lapNumber = lapNumber;
        this.raceNumbers = raceNumbers;
    }

    public Integer getLapNumber() {
        return lapNumber;
    }

    public List<String> getRaceNumbers() {
        return raceNumbers;
    }
}

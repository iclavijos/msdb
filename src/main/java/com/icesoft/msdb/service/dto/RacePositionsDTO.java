package com.icesoft.msdb.service.dto;

import java.util.ArrayList;
import java.util.List;

public class RacePositionsDTO {

    public class RacePosition {
        private String raceNumber;
        private Integer position;

        public String getRaceNumber() {
            return raceNumber;
        }

        public Integer getPosition() {
            return position;
        }

        public RacePosition(String raceNumber, Integer position) {

            this.raceNumber = raceNumber;
            this.position = position;
        }
    }

    private Integer lapNumber;
    private List<RacePosition> racePositions;

    public RacePositionsDTO(Integer lapNumber, List<String> raceNumbers) {
        this.lapNumber = lapNumber;
        this.racePositions = new ArrayList<>();
        int pos = 1;
        for(String raceNumber: raceNumbers) {
            this.racePositions.add(new RacePosition(raceNumber, pos++));
        }
    }

    public Integer getLapNumber() {
        return lapNumber;
    }

    public List<RacePosition> getRacePositions() {
        return racePositions;
    }
}

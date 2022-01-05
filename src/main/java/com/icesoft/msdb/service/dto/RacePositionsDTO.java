package com.icesoft.msdb.service.dto;

import io.vavr.Tuple6;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class RacePositionsDTO {

    @Getter
    @AllArgsConstructor
    public class RacePosition {
        private String raceNumber;
        private String driverName;
        private Integer position;
        private Integer lostLaps;
        private Long accumulatedRaceTime;
        private Boolean pitstop;
        @Setter
        private String tyreCompound;

        public RacePosition(String raceNumber, Integer position) {
            this.raceNumber = raceNumber;
            this.position = position;
            this.accumulatedRaceTime = 0L;
        }
    }

    private Integer lapNumber;
    private List<RacePosition> racePositions;

    public RacePositionsDTO(Integer lapNumber, List<Tuple6<String, String, Long, Integer, Boolean, String>> driverNumbersAndRaceTime) {
        this.lapNumber = lapNumber;
        this.racePositions = new ArrayList<>();
        int pos = 1;
        for(Tuple6<String, String, Long, Integer, Boolean, String> raceNumber: driverNumbersAndRaceTime) {
            this.racePositions.add(new RacePosition(raceNumber._1, raceNumber._2, pos++, raceNumber._4, raceNumber._3, raceNumber._5, raceNumber._6));
        }
    }
}

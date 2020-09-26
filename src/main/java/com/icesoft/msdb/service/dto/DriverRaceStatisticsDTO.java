package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.LapInfo;

import java.util.*;
import java.util.stream.Collectors;

public class DriverRaceStatisticsDTO {

    public class LapData {
        private Integer lapNumber;
        private Long lapTime;

        public Integer getLapNumber() {
            return lapNumber;
        }

        public Long getLapTime() {
            return lapTime;
        }

        public LapData(LapInfo lapInfo) {

            this.lapNumber = lapInfo.getLapNumber();
            this.lapTime = lapInfo.getLapTime();
        }
    }

    private List<LapInfo> laps;
    private String driverName;
    private Long best5Avg;
    private Long best10Avg;
    private Long best20Avg;
    private Long best50Avg;
    private Long average110;
    private Long bestS1;
    private Long bestS2;
    private Long bestS3;
    private Integer numUsedLapsAvg;
    private List<Long> averagePerStint;
    private List<String> lapsStint;

    public DriverRaceStatisticsDTO(List<LapInfo> driverLaps) {
        this.laps = driverLaps;
        this.driverName = driverLaps.get(0).getDriverName();
        this.best5Avg = calculateAverage(5);
        this.best10Avg = calculateAverage(10);
        this.best20Avg = calculateAverage(20);
        this.best50Avg = calculateAverage(50);
        calculateBestSectors();
        calculateAverageStints();
        calculateAverage110();
    }

    public String getDriverName() {
        return driverName;
    }

    public Long getBest5Avg() {
        return best5Avg;
    }

    public Long getBest10Avg() {
        return best10Avg;
    }

    public Long getBest20Avg() {
        return best20Avg;
    }

    public Long getBest50Avg() { return best50Avg; }

    public List<Long> getAveragePerStint() {
        return averagePerStint;
    }

    public Long getAverage110() {
        return average110;
    }

    public Integer getNumUsedLapsAvg() {
        return numUsedLapsAvg;
    }

    public List<String> getLapsStint() {
        return lapsStint;
    }

    public Long getBestS1() {
        return bestS1;
    }

    public Long getBestS2() {
        return bestS2;
    }

    public Long getBestS3() {
        return bestS3;
    }

    public List<LapData> getBestLaps() {
        return laps.parallelStream().sorted(Comparator.comparing(LapInfo::getLapTime)).limit(20).map(LapData::new).collect(Collectors.toList());
    }

    private void calculateBestSectors() {
        if (laps.get(0).getS1() != null) {
            bestS1 = laps.parallelStream().map(LapInfo::getS1).min(Long::compareTo).orElse(0l);
            bestS2 = laps.parallelStream().map(LapInfo::getS2).min(Long::compareTo).orElse(0l);
            bestS3 = laps.parallelStream().map(LapInfo::getS3).min(Long::compareTo).orElse(0l);
        }
    }

    private Long calculateAverage(int numberOfLaps) {
        if (laps.size() < numberOfLaps) {
            return 0L;
        }
        OptionalDouble average = laps.parallelStream().limit(numberOfLaps).mapToLong(li -> li.getLapTime()).average();
        Double res = average.getAsDouble();
        return res.longValue();
    }

    private void calculateAverageStints() {
        this.averagePerStint = new ArrayList<>();
        laps = laps.parallelStream().sorted(Comparator.comparing(LapInfo::getLapNumber)).collect(Collectors.toList());
        this.lapsStint = new ArrayList<>();

        LapInfo startLap = laps.get(0);
        LapInfo endLap = null;
        Long totalStintTime = startLap.getLapTime();
        Long average;
        boolean startStint = false;
        if (laps.size() == 1) {
            //Only completed first lap
            averagePerStint.add(startLap.getLapTime());
            lapsStint.add(startLap.getLapNumber() + "-" + startLap.getLapNumber());
        }
        for(int i = 1; i < laps.size(); i++) {
            if (startStint) {
                startLap = laps.get(i);
                totalStintTime = startLap.getLapTime();
                startStint = false;
            } else {
                endLap = laps.get(i);
                totalStintTime += endLap.getLapTime();
                average = totalStintTime / (endLap.getLapNumber() - startLap.getLapNumber() + 1);
                if (endLap.getPitstop()) {
                    averagePerStint.add(average);
                    lapsStint.add(startLap.getLapNumber() + "-" + endLap.getLapNumber());
                    //Another stint
                    startStint = true;
                    endLap = null;
                }
            }
        }
        if (!startStint) {
            //Stint ended outside pitboxes
            if (endLap == null) {
                totalStintTime += startLap.getLapTime();
                endLap = startLap;
            }
            average = totalStintTime / (endLap.getLapNumber() - startLap.getLapNumber() + 1);
            averagePerStint.add(average);
            lapsStint.add(startLap.getLapNumber() + "-" + endLap.getLapNumber());
        }
    }

    private void calculateAverage110() {
        Double lapTime110 = laps.get(0).getLapTime() * 1.1d;
        LongSummaryStatistics stream = laps.parallelStream()
            .filter(l -> l.getLapTime() < lapTime110.longValue())
            .mapToLong(LapInfo::getLapTime).summaryStatistics();
        Double avg = stream.getAverage();
        this.average110 = avg.longValue();
        this.numUsedLapsAvg = (int)stream.getCount();
    }
}

package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.LapInfo;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DriverRaceStatisticsDTO {

    private List<LapInfo> laps;
    private String driverName;
    private Long best5Avg;
    private Long best10Avg;
    private Long best20Avg;
    private Long average110;
    private Integer numUsedLapsAvg;
    private List<Long> averagePerStint;
    private List<String> lapsStint;

    public DriverRaceStatisticsDTO(List<LapInfo> driverLaps) {
        this.laps = driverLaps;
        this.driverName = driverLaps.get(0).getDriverName();
        this.best5Avg = calculateAverage(5);
        this.best10Avg = calculateAverage(10);
        this.best20Avg = calculateAverage(20);
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

    private Long calculateAverage(int numberOfLaps) {
        OptionalDouble average = laps.parallelStream().limit(numberOfLaps).mapToLong(li -> li.getLapTime()).average();
        Double res = average.getAsDouble();
        return res.longValue();
    }

    private void calculateAverageStints() {
        this.averagePerStint = new ArrayList<>();
        this.lapsStint = new ArrayList<>();
        List<Integer> lapsPitIn = laps.parallelStream()
            .filter(LapInfo::getPitstop)
            .map(LapInfo::getLapNumber)
            .sorted().collect(Collectors.toList());
        int startStintLap = laps.parallelStream().sorted(Comparator.comparing(LapInfo::getLapNumber)).findFirst().get().getLapNumber();
        if (!lapsPitIn.isEmpty()) {
            if (lapsPitIn.get(lapsPitIn.size() - 1) != laps.get(laps.size() - 1).getLapNumber()) {
                lapsPitIn.add(laps.size());
            }
        } else {
            lapsPitIn.add(laps.size());
        }

        for(Integer pitstopLap: lapsPitIn) {
            final int startLap = startStintLap + 1;

            Double avg = laps.parallelStream()
                .filter(l -> startLap <= l.getLapNumber() && l.getLapNumber() <= (pitstopLap == laps.size() ? pitstopLap : pitstopLap - 1))
                .mapToLong(LapInfo::getLapTime).average().orElse(0d);
            if (startStintLap < pitstopLap) {
                averagePerStint.add(avg.longValue());
                lapsStint.add(startStintLap + "-" + pitstopLap);
            }
            startStintLap = pitstopLap + 1;
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

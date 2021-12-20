package com.icesoft.msdb.domain;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.service.dto.RacePositionsDTO;
import io.vavr.Tuple;
import io.vavr.Tuple4;
import io.vavr.Tuple5;
import io.vavr.Tuple6;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.util.MathUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document
public class SessionLapData {

	@Id
	private String sessionId;

	private List<LapInfo> laps = new ArrayList<>();

	private Map<String, DriverPerformance> driversPerformance = new HashMap<>();

	public void addLapData(LapInfo lapData) {
   		laps.add(lapData);
	}

	public void processData(List<EventEditionEntry> entries) {
		Map<Integer, List<LapInfo>> dataPerLap = new HashMap<>();
		Map<String, String> entryCategory = new HashMap<>();

		entries.forEach(entry -> entryCategory.put(
            entry.getRaceNumber(),
            entry.getCategory().getShortname())
        );

		LapInfo fastestLap = null;

		laps.forEach(lapData -> {
		    lapData.setCategory(entryCategory.get(lapData.getRaceNumber()));
		    // Replace driver names with those used in entries
            Optional<EventEditionEntry> entry = entries.stream()
                .filter(e -> e.getRaceNumber().equals(lapData.getRaceNumber()))
                .findFirst();
            if (entry.isPresent()) {
                String[] importedName = lapData.getDriverName().split(" ");
                String importedLastName = importedName[importedName.length - 1];
                String fullName = entry.get().getDrivers().stream()
                    .filter(d ->
                        StringUtils.stripAccents(d.getDriver().getFullName().toLowerCase()).endsWith(
                            StringUtils.stripAccents(importedLastName.toLowerCase())))
                    .findFirst().orElseThrow(() -> new MSDBException("No entry found for driver " + lapData.getDriverName()))
                    .getDriver().getFullName();
                lapData.setDriverName(fullName);
            }
	   		if (!dataPerLap.containsKey(lapData.getLapNumber())) {
				dataPerLap.put(lapData.getLapNumber(), new ArrayList<>());
			}
			dataPerLap.get(lapData.getLapNumber()).add(lapData);
		});

		for(Integer lapNumber : dataPerLap.keySet()) {
			if (lapNumber > 1) {
				List<LapInfo> lapTimes = dataPerLap.get(lapNumber);
				LapInfo fastLap = lapTimes.stream().filter(Objects::nonNull)
                    .sorted(Comparator.comparing(LapInfo::getLapTime)).findFirst().get();
				if (fastestLap == null) {
					fastestLap = fastLap;
					fastLap.setFastestLap(true);
				}
				if (fastLap.getLapTime() < fastestLap.getLapTime()) {
					fastestLap.setFastLap(true);
					fastestLap.setFastestLap(false);
					fastestLap = fastLap;
					fastestLap.setFastestLap(true);
				}
			}
		}

        laps.stream().map(li -> li.getRaceNumber()).distinct().forEach(raceNumber -> {
            AtomicReference<LapInfo> personalBest = new AtomicReference<>();
            AtomicReference<Integer> lapCounter = new AtomicReference<>(1);
            laps.stream().filter(li -> li.getRaceNumber().equals(raceNumber))
                .sorted(Comparator.comparing(LapInfo::getLapNumber))
                .forEach(lap -> {
                    if (lapCounter.get().intValue() == 1) {
                        personalBest.set(lap);
                    }
                    if (lap.getLapTime() < personalBest.get().getLapTime()) {
                        personalBest.set(lap);
                        if (!personalBest.get().getFastestLap() && !personalBest.get().getFastLap()) {
                            personalBest.get().setPersonalBest(true);
                        }
                    }
                    lapCounter.set(lapCounter.get().intValue() + 1);
                });
        });


		laps.stream().map(li -> li.getDriverName()).distinct().forEach(driver -> {
            DriverPerformance dp = new DriverPerformance(driver);
            DescriptiveStatistics stats = new DescriptiveStatistics();
		    List<Double> lapTimes = laps.stream().filter(li -> li.getDriverName().equals(driver))
                .peek(li -> dp.setCategory(li.getCategory()))
                .map(li -> li.getLapTime().doubleValue())
                .sorted(Comparator.naturalOrder())
                .limit(20)
                .peek(li -> stats.addValue(li))
                .collect(Collectors.toList());

		    lapTimes = eliminateOutliers(lapTimes, stats, 1.5f);
            if (lapTimes.size() >= 15) {
                //If driver did not complete at least 15 valid laps, it is discarded
                stats.clear();
                lapTimes.stream().forEach(lt -> stats.addValue(lt));
                dp.setMax(stats.getMax());
                dp.setMean(stats.getMean());
                dp.setMin(stats.getMin());
                dp.setQ1(stats.getPercentile(25));
                dp.setQ3(stats.getPercentile(75));
                driversPerformance.put(driver, dp);
            }
        });
	}

    private List<Double> eliminateOutliers(List<Double> lapTimes, DescriptiveStatistics stats, float scaleOfElimination) {
        double mean = stats.getMean();
        double stdDev = stats.getStandardDeviation();

        return lapTimes.stream()
            .filter(lt -> !isOutOfBounds(lt, mean, stdDev, scaleOfElimination))
            .collect(Collectors.toList());
    }

    private boolean isOutOfBounds(Double value, Double mean, Double stdDev, float scaleOfElimination) {
        return value > mean + stdDev * scaleOfElimination; // Only too slow laps are removed || value < mean - stdDev * scaleOfElimination;
    }

	@JsonIgnore
    public List<List<LapInfo>> getLapsPerDriver() {
        List<String> drivers = laps.parallelStream().map(li -> li.getDriverName())
            .distinct().collect(Collectors.toList());
        return drivers.parallelStream().map(d ->
            laps.parallelStream().filter(li ->
                li.getDriverName().equals(d)).sorted(
                    Comparator.comparing(LapInfo::getLapTime))
                .collect(Collectors.toList()))
            .collect(Collectors.toList());
    }

    @JsonIgnore
    public List<RacePositionsDTO> getPositionsPerLap() {
        List<RacePositionsDTO> result = new ArrayList<>();
        Map<String, Long> driversTotalTime = new HashMap<>();
        Map<Integer, List<LapInfo>> driversLapsPerLap = new HashMap<>();
        List<Integer> lapNumbers = laps.stream()
            .map(LapInfo::getLapNumber)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        lapNumbers.forEach(lapNumber -> {
            driversLapsPerLap.put(lapNumber, new ArrayList<>());
            laps.stream()
                .filter(li -> li.getLapNumber().equals(lapNumber))
                .forEach(lap -> {
                    List<LapInfo> lapsLap = driversLapsPerLap.get(lapNumber);
                    lapsLap.add(lap);
                    // driversLapsPerLap.put(lapNumber, lapsLap);
                });
        });
        lapNumbers.forEach(lapNumber ->
            result.add(new RacePositionsDTO(
                lapNumber,
                addCompletedLaps(
                    driversTotalTime,
                    driversLapsPerLap.get(lapNumber)
                )
            )));

        return result;
    }

    private List<Tuple6<String, String, Long, Integer, Boolean, String>> addCompletedLaps(Map<String, Long> driversTotalTime, List<LapInfo> completedLaps) {
        Map<String, Long> totalTimesCurrentLap = Collections.synchronizedMap(new HashMap<>());
	    completedLaps.stream().forEach(li -> {
            String raceNumber = li.getRaceNumber();
            Long totalTime = driversTotalTime.get(raceNumber);
            if (totalTime == null) {
                totalTime = 0L;
            }
            totalTime += li.getLapTime();
            driversTotalTime.put(raceNumber, totalTime);
            totalTimesCurrentLap.put(raceNumber, totalTime);
        });
	    return sortByTotalTimeAndCompletedLaps(totalTimesCurrentLap, completedLaps);
    }

    private List<Tuple6<String, String, Long, Integer, Boolean, String>> sortByTotalTimeAndCompletedLaps(Map<String, Long> totalTimes, List<LapInfo> completedLaps) {
        return completedLaps.stream()
            .sorted((li1, li2) -> {
                int comp = li1.getLostLaps().compareTo(li2.getLostLaps());
                if (comp == 0) {
                    return totalTimes.get(li1.getRaceNumber()).compareTo(totalTimes.get(li2.getRaceNumber()));
                } else {
                    return comp;
                }
            })
            .map(li -> Tuple.of(li.getRaceNumber(), li.getDriverName(), totalTimes.get(li.getRaceNumber()), li.getLostLaps(), li.getPitstop(), li.getTyreCompound()))
            .collect(Collectors.toList());
    }

	public List<LapInfo> getLaps() {
		return laps;
	}

	@JsonIgnore
	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String id) {
		this.sessionId = id;
	}

	@JsonIgnore
    public Map<String, DriverPerformance> getDriversPerformance() { return this.driversPerformance; }


}

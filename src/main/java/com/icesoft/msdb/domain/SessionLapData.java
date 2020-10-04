package com.icesoft.msdb.domain;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.icesoft.msdb.service.dto.RacePositionsDTO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document
public class SessionLapData {

	@Id
	private String sessionId;

	private List<LapInfo> laps = new ArrayList<>();

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

		laps.stream().forEach(lapData -> {
		    lapData.setCategory(entryCategory.get(lapData.getRaceNumber()));
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
        List<Integer> lapNumber = laps.stream().map(lapInfo -> lapInfo.getLapNumber()).distinct().sorted().collect(Collectors.toList());
        for(Integer lNumber: lapNumber) {
            List<LapInfo> completedLaps = laps.stream().filter(li -> li.getLapNumber().equals(lNumber))
                .collect(Collectors.toList());
            result.add(new RacePositionsDTO(lNumber, addCompletedLaps(driversTotalTime, completedLaps)));
        };

        return result;
    }

    private List<String> addCompletedLaps(Map<String, Long> driversTotalTime, List<LapInfo> completedLaps) {
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
	    return totalTimesCurrentLap.entrySet().stream()
            .sorted(Map.Entry.comparingByValue()).map(Map.Entry::getKey).collect(Collectors.toList());
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


}

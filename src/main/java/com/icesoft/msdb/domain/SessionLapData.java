package com.icesoft.msdb.domain;

import java.util.*;
import java.util.stream.Collectors;

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

	public void processData() {
		Map<Integer, List<LapInfo>> dataPerLap = new HashMap<>();

		LapInfo fastestLap = null;

		laps.parallelStream().forEach(lapData -> {
	   		if (!dataPerLap.containsKey(lapData.getLapNumber())) {
				dataPerLap.put(lapData.getLapNumber(), new ArrayList<>());
			}
			dataPerLap.get(lapData.getLapNumber()).add(lapData);
		});

		for(Integer lapNumber : dataPerLap.keySet()) {
			if (lapNumber > 1) {
				List<LapInfo> lapTimes = dataPerLap.get(lapNumber);
				LapInfo fastLap = lapTimes.parallelStream()
                    .sorted((l1, l2) -> l1.getLapTime().compareTo(l2.getLapTime())).findFirst().get();
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

		LapInfo personalBest = null;
		for(LapInfo lap: laps) {
			if (lap.getLapNumber() == 1) {
				personalBest = lap;
			} else {
				if (lap.getLapTime() < personalBest.getLapTime()) {
					personalBest = lap;
					if (!personalBest.getFastestLap() && !personalBest.getFastLap()) {
						personalBest.setPersonalBest(true);
					}
				}
			}
		}
	}

	@JsonIgnore
    public List<List<LapInfo>> getLapsPerDriver() {
        List<String> drivers = laps.parallelStream().map(li -> li.getDriverName())
            .distinct().collect(Collectors.toList());
        return drivers.parallelStream().map(d -> {
	        return laps.parallelStream().filter(li -> li.getDriverName().equals(d)).sorted(
                Comparator.comparing(LapInfo::getLapTime)).collect(Collectors.toList());
        }).collect(Collectors.toList());

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

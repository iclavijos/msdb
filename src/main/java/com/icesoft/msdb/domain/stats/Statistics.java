package com.icesoft.msdb.domain.stats;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icesoft.msdb.domain.EventEntryResult;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class Statistics {

	private int participations = 0;
	private int starts = 0;
	private int finished = 0;
	private int retirements = 0;
	private int wins = 0;
	private int championships = 0;
	private int top3 = 0;
	private int top5 = 0;
	private int top10 = 0;
	private int poles = 0;
	private int top2Q = 0;
	private int top3Q = 0;
	private int fastLaps = 0;
	private int grandChelems = 0;
	private float points = 0;
	private int lapsCompleted = 0;
	private float kmsCompleted = 0f;
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private Map<Integer, Integer> finalPositionsR = new TreeMap<>();
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private Map<Integer, Integer> finalPositionsQ = new TreeMap<>();
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private List<Result> results = new ArrayList<>();
	
	public void incParticipations() {
		participations++;
	}
	
	public void incFastLaps() {
		fastLaps++;
	}
	
	public void incGrandChelems() {
		grandChelems++;
	}
	
	public void addPoints(float points) {
		this.points += points;
	}
	
	public void addLaps(int laps, int lapLength) {
		lapsCompleted += laps;
		kmsCompleted += (laps * lapLength) / 1000f;
	}
	
	public void addFinishPositionR(int finalPosition, boolean retired) {
		if (finalPosition <= 10) {
			top10++;
		}
		if (finalPosition <=5) {
			top5++;
		}
		if (finalPosition <= 3) {
			top3++;
		}
		if (finalPosition == 1) {
			wins++;
		}
		
		if (finalPosition != 901) { //DNS
			starts++;
		}
		
		if (finalPosition != 900 && finalPosition != 901 && !retired) {
			finished++;
		}
		
		if (retired) {
			retirements++;
		}
		
		Integer positionCount = finalPositionsR.get(finalPosition);
		if (positionCount == null) {
			positionCount = 0;
		}
		positionCount++;
		finalPositionsR.put(finalPosition, positionCount);
	}
	
	public void addFinishPositionQ(int finalPosition) {
		if (finalPosition <= 3) {
			top3Q++;
		}
		if (finalPosition <= 2) {
			top2Q++;
		}
		if (finalPosition == 1) {
			poles++;
		}
		Integer positionCount = finalPositionsQ.get(finalPosition);
		if (positionCount == null) {
			positionCount = 0;
		}
		positionCount++;
		finalPositionsQ.put(finalPosition, positionCount);
	}
	
	public Integer getBestFinishingPosR() {
		return finalPositionsR.entrySet().parallelStream()
				.min((e1, e2) -> e1.getKey().compareTo(e2.getKey()))
				.map(entry -> entry.getKey()).orElse(null);
	}
	
	public Integer getBestFinishingPosTimesR() {
		Integer bestFP = getBestFinishingPosR();
		
		if (bestFP != null) {
			return finalPositionsR.get(bestFP);
		}
		return null;
	}
	
	public Integer getBestFinishingPosQ() {
		return finalPositionsQ.entrySet().parallelStream()
				.min((e1, e2) -> e1.getKey().compareTo(e2.getKey()))
				.map(entry -> entry.getKey()).orElse(null);
	}
	
	public Integer getBestFinishingPosTimesQ() {
		Integer bestFP = getBestFinishingPosQ();
		
		if (bestFP != null) {
			return finalPositionsQ.get(bestFP);
		}
		return null;
	}
	
	public void addResult(EventEntryResult result, Boolean grandChelem, Integer finalPosition, Integer gridPosition) {
		int order = results.size() + 1;
		Result r = Result.builder()
				.order(order)
				.eventEditionId(result.getEntry().getEventEdition().getId())
				.eventName(result.getEntry().getEventEdition().getLongEventName())
				.year(result.getEntry().getEventEdition().getEditionYear())
				.position(finalPosition)
				.gridPosition(gridPosition)
				.lapsLed(result.getLapsLed())
				.grandChelem(grandChelem)
				.build();
		results.add(r);
	}
	
	@JsonIgnore
	public List<Result> getWinsList() {
		return results.stream().filter(r -> r.getPosition() == 1).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getWinsList(Integer year) {
		return getWinsList().stream().filter(r -> r.getYear().equals(year)).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getPolesList() {
		return results.stream().filter(r -> r.getGridPosition() == 1).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getGrandChelemsList() {
		return results.stream().filter(r -> r.getGrandChelem()).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getPodiumsList() {
		return results.stream().filter(r -> r.getPosition() <= 3).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getRacesLed() {
		return results.stream().filter(r -> r.getLapsLed() > 0).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDNFsList() {
		return results.stream().filter(r -> r.getPosition() == 900).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDNSsList() {
		return results.stream().filter(r -> r.getPosition() == 902).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDSQsList() {
		return results.stream().filter(r -> r.getPosition() == 901).collect(Collectors.toList());
	}
	
}

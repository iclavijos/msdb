package com.icesoft.msdb.domain.stats;

import java.util.Map;
import java.util.TreeMap;

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
	private int top3 = 0;
	private int top5 = 0;
	private int top10 = 0;
	private int poles = 0;
	private int top2Q = 0;
	private int top3Q = 0;
	private int fastLaps = 0;
	private float points = 0;
	private int lapsCompleted = 0;
	private float kmsCompleted = 0f;
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private Map<Integer, Integer> finalPositionsR = new TreeMap<>();
	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	private Map<Integer, Integer> finalPositionsQ = new TreeMap<>();
	
	public void incParticipations() {
		participations++;
	}
	
	public void incFastLaps() {
		fastLaps++;
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
}

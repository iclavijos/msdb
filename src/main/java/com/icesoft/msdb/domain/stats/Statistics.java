package com.icesoft.msdb.domain.stats;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icesoft.msdb.domain.EventEntryResult;

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
	private Map<Integer, Integer> finalPositionsR = new TreeMap<>();
	private Map<Integer, Integer> finalPositionsQ = new TreeMap<>();
	private List<Result> results = new ArrayList<>();
	
	public int getParticipations() {
		return participations;
	}

	public void setParticipations(int participations) {
		this.participations = participations;
	}

	public int getStarts() {
		return starts;
	}

	public void setStarts(int starts) {
		this.starts = starts;
	}

	public int getFinished() {
		return finished;
	}

	public void setFinished(int finished) {
		this.finished = finished;
	}

	public int getRetirements() {
		return retirements;
	}

	public void setRetirements(int retirements) {
		this.retirements = retirements;
	}

	public int getWins() {
		return wins;
	}

	public void setWins(int wins) {
		this.wins = wins;
	}

	public int getChampionships() {
		return championships;
	}

	public void setChampionships(int championships) {
		this.championships = championships;
	}

	public int getTop3() {
		return top3;
	}

	public void setTop3(int top3) {
		this.top3 = top3;
	}

	public int getTop5() {
		return top5;
	}

	public void setTop5(int top5) {
		this.top5 = top5;
	}

	public int getTop10() {
		return top10;
	}

	public void setTop10(int top10) {
		this.top10 = top10;
	}

	public int getPoles() {
		return poles;
	}

	public void setPoles(int poles) {
		this.poles = poles;
	}

	public int getTop2Q() {
		return top2Q;
	}

	public void setTop2Q(int top2q) {
		top2Q = top2q;
	}

	public int getTop3Q() {
		return top3Q;
	}

	public void setTop3Q(int top3q) {
		top3Q = top3q;
	}

	public int getFastLaps() {
		return fastLaps;
	}

	public void setFastLaps(int fastLaps) {
		this.fastLaps = fastLaps;
	}

	public int getGrandChelems() {
		return grandChelems;
	}

	public void setGrandChelems(int grandChelems) {
		this.grandChelems = grandChelems;
	}

	public float getPoints() {
		return points;
	}

	public void setPoints(float points) {
		this.points = points;
	}

	public int getLapsCompleted() {
		return lapsCompleted;
	}

	public void setLapsCompleted(int lapsCompleted) {
		this.lapsCompleted = lapsCompleted;
	}

	public float getKmsCompleted() {
		return kmsCompleted;
	}

	public void setKmsCompleted(float kmsCompleted) {
		this.kmsCompleted = kmsCompleted;
	}

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
		
		Result r = new Result();
		r.setEventDate(result.getEntry().getEventEdition().getEventDate());
		r.setEventEditionId(result.getEntry().getEventEdition().getId());
		r.setEventName(result.getEntry().getEventEdition().getLongEventName());
		r.setGrandChelem(grandChelem);
		r.setGridPosition(gridPosition);
		r.setLapsLed(result.getLapsLed());
		r.setLapsCompleted(result.getLapsCompleted());
		r.setPosition(finalPosition);
		r.setRetired(result.isRetired());
		r.setYear(result.getEntry().getEventEdition().getEditionYear());
		r.setPitlaneStart(result.isPitlaneStart());
		
		results.add(r);
		results.sort((r1, r2) -> r1.getEventDate().compareTo(r2.getEventDate()));
		int pos = results.indexOf(r);
		r.setOrder(pos + 1);
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
		return results.stream().filter(r -> r.getPosition() == 900 || r.getRetired()).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDNSsList() {
		return results.stream().filter(r -> r.getPosition() == 902).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDSQsList() {
		return results.stream().filter(r -> r.getPosition() == 901).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getPitlaneStarts() {
		return results.stream().filter(r -> r.getPitlaneStart()).collect(Collectors.toList());
	}
	
}

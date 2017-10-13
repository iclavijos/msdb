package com.icesoft.msdb.domain.stats;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Statistics {
	
	protected class ChampionshipData {
		String name;
		String year;
		Long id;
		
		public ChampionshipData(String name, String year, Long id) {
			this.name = name;
			this.year = year;
			this.id = id;
		}
		
		public String getName() {
			return name;
		}
		public String getYear() {
			return year;
		}
		public Long getId() {
			return id;
		}
	}

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
	private float metersCompleted = 0f;
	private Map<Integer, Integer> finalPositionsR = new TreeMap<>();
	private Map<Integer, Integer> finalPositionsQ = new TreeMap<>();
	private List<Result> results = new ArrayList<>();
	private List<ChampionshipData> championshipsData = new ArrayList<>();
	
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
	
	public List<ChampionshipData> getChampionshipsData() {
		return championshipsData;
	}
	
	public void addChampionship(String championship, String year, Long id) {
		championshipsData.add(new ChampionshipData(championship, year, id));
		Collections.sort(championshipsData, (d1, d2) -> d1.getYear().compareTo(d2.getYear()));
		Collections.reverse(championshipsData);
		championships++;
	}
	
	public void removeChampionship(Long id) {
		championshipsData.removeIf(d -> d.getId().equals(id));
		if (championships > 0) {
			championships--;
		}
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
		return metersCompleted;
	}

	public void setKmsCompleted(float kmsCompleted) {
		this.metersCompleted = kmsCompleted;
	}

	public void addLaps(int laps, int lapLength) {
		lapsCompleted += laps;
		metersCompleted += laps * lapLength;
	}
	
	public void removeLaps(int laps, int lapLength) {
		lapsCompleted -= laps;
		metersCompleted -= laps * lapLength;
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
	
	public void removeFinishPositionR(int finalPosition, boolean retired) {
		if (finalPosition <= 10) {
			top10--;
		}
		if (finalPosition <=5) {
			top5--;
		}
		if (finalPosition <= 3) {
			top3--;
		}
		if (finalPosition == 1) {
			wins--;
		}
		
		if (finalPosition != 901) { //DNS
			starts--;
		}
		
		if (finalPosition != 900 && finalPosition != 901 && !retired) {
			finished--;
		}
		
		if (retired) {
			retirements--;
		}
		
		Integer positionCount = finalPositionsR.get(finalPosition);
		positionCount--;
		if (positionCount == 0) {
			finalPositionsR.remove(finalPosition);
		} else {
			finalPositionsR.put(finalPosition, positionCount);
		}
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
	
	public void removeFinishPositionQ(int finalPosition) {
		if (finalPosition <= 3) {
			top3Q--;
		}
		if (finalPosition <= 2) {
			top2Q--;
		}
		if (finalPosition == 1) {
			poles--;
		}
		Integer positionCount = finalPositionsQ.get(finalPosition);
		positionCount--;
		if (positionCount == 0) {
			finalPositionsQ.remove(finalPosition);
		} else {
			finalPositionsQ.put(finalPosition, positionCount);
		}
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
	
	public void addResult(Result r) {
		participations++;
		
		if (r.getLapsCompleted() != null && !r.isMultidriver()) {
			//We do not count laps for multidriver events
			addLaps(r.getLapsCompleted(), r.getLapLength());
		}
		if (r.getGridPosition() != null) {
			this.addFinishPositionQ(r.getGridPosition());
		}
		this.addFinishPositionR(r.getPosition(), r.getRetired());
		
		if (r.getRaceFastLap()) {
			fastLaps++;
		}
		if (r.getGrandChelem()) {
			grandChelems++;
		}
		
		points += r.getPoints();

		results.add(r);
		final AtomicInteger i = new AtomicInteger(1);
		results.sort((r1, r2) -> r1.getEventDate().compareTo(r2.getEventDate()));
		results.forEach(res -> res.setOrder(i.getAndIncrement()));
	}
	
	public void removeResult(Result r) {	
		participations--;
		
		if (r.getLapsCompleted() != null && !r.isMultidriver()) {
			//We do not count laps for multidriver events
			removeLaps(r.getLapsCompleted(), r.getLapLength());
		}
		if (r.getGridPosition() != null) {
			this.removeFinishPositionQ(r.getGridPosition());
		}
		this.removeFinishPositionR(r.getPosition(), r.getRetired());
		
		if (r.getRaceFastLap()) {
			fastLaps--;
		}
		if (r.getGrandChelem()) {
			grandChelems--;
		}
		points -= r.getPoints();
		
		int pos = results.indexOf(r);
		if (pos >= 0) {
			results.remove(pos);
			for (int i = pos; i < results.size(); i++) {
				Result res = results.get(i);
				res.setOrder(r.getOrder() - 1);
			}
		}
	}
	
	@JsonIgnore
	public List<Result> getResultByEventId(Long id) {
		return results.parallelStream().filter(r -> r.getEventEditionId().equals(id)).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getResultByEntryId(Long id) {
		return results.parallelStream().filter(r -> r.getEntryId().equals(id)).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getParticipationsList() {
		return results;
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
			return results.stream().filter(r -> r.getPosition() == 901).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getDSQsList() {
			return results.stream().filter(r -> r.getPosition() == 902).collect(Collectors.toList());
	}
	
	@JsonIgnore
	public List<Result> getPitlaneStarts() {
			return results.stream().filter(r -> r.getPitlaneStart()).collect(Collectors.toList());
	}
	
}

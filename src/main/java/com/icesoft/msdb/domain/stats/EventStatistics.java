package com.icesoft.msdb.domain.stats;

import java.util.Date;
import java.util.List;

public abstract class EventStatistics extends Statistics {
	
	protected class FastLap {
		final String driverName;
		final Long lapTime;
		final Date date;
		
		public FastLap(String driverName, Long lapTime, Date date) {
			this.driverName = driverName;
			this.lapTime = lapTime;
			this.date = date;
		}

		public String getDriverName() {
			return driverName;
		}

		public Long getLapTime() {
			return lapTime;
		}
		
		public Date getDate() {
			return date;
		}
	}

	protected class Winner {
		String driverName;
		Integer numVictories;
		
		public Winner(String driverName, Integer numVictories) {
			this.driverName = driverName;
			this.numVictories = numVictories;
		}

		public String getDriverName() {
			return driverName;
		}

		public Integer getNumVictories() {
			return numVictories;
		}
	}
	
	protected class Leader {
		String driverName;
		Integer ledLaps;
		
		public Leader(String driverName, Integer ledLaps) {
			this.driverName = driverName;
			this.ledLaps = ledLaps;
		}

		public String getDriverName() {
			return driverName;
		}

		public Integer getLedLaps() {
			return ledLaps;
		}
	}
	
	protected class Poleman {
		String driverName;
		Integer poles;
		
		public Poleman(String driverName, Integer poles) {
			this.driverName = driverName;
			this.poles = poles;
		}

		public String getDriverName() {
			return driverName;
		}

		public Integer getPoles() {
			return poles;
		}
	}
	
	private Integer numEditions;
	private List<Winner> winners;
	private List<Leader> leaders;
	private List<Poleman> polemen;
	private FastLap raceFastestLap;
	private FastLap qualyFastestLap;
	
	public Integer getNumEditions() {
		return numEditions;
	}
	public List<Winner> getWinners() {
		return winners;
	}
	public List<Leader> getLeaders() {
		return leaders;
	}
	public List<Poleman> getPolemen() {
		return polemen;
	}
	public FastLap getRaceFastestLap() {
		return raceFastestLap;
	}
	public void setRaceFastestLap(FastLap raceFastestLap) {
		this.raceFastestLap = raceFastestLap;
	}
	public FastLap getQualyFastestLap() {
		return qualyFastestLap;
	}
	public void setQualyFastestLap(FastLap qualyFastestLap) {
		this.qualyFastestLap = qualyFastestLap;
	}
	
}

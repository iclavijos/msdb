package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;

public class EventEntrySearchResultDTO {
	private String raceNumber;
	private String entryName;
	private long driverId = -1;
	private Long eventEditionId;
	private String driverName;
	private String eventName;
	private String chassisEngine;
	private Integer editionYear;
	private Long poleTime;
	private Integer polePosition;
	private Long raceFastLap;
	private Integer racePosition;
	private String retirement;
	private Long fastestLap;
	private String session;
	private String raceStatus;

	public EventEntrySearchResultDTO(EventEditionEntry entry, Long poleTime, Long raceFastLap, Integer polePosition, 
			Integer racePosition, String retirement, Long fastestLap, String session) {
		this.raceNumber = entry.getRaceNumber();
		this.entryName = entry.getEntryName();
		this.eventEditionId = entry.getEventEdition().getId();
		this.editionYear = entry.getEventEdition().getEditionYear();
		this.eventName = entry.getEventEdition().getLongEventName();
		if (!entry.getEventEdition().isMultidriver()) {
			this.driverId = entry.getDrivers().get(0).getId();
		}
		this.driverName = entry.getDriversName();
		chassisEngine = entry.getChassis().getManufacturer() + " " + entry.getChassis().getName();
		chassisEngine += '/' + entry.getEngine().getManufacturer() + " " + entry.getEngine().getName();
		double capacity = new java.math.BigDecimal(entry.getEngine().getCapacity() / 1000d)
				.setScale(1, java.math.BigDecimal.ROUND_HALF_UP).doubleValue();
		chassisEngine += " " + capacity + " " + entry.getEngine().getArchitecture();
		
		this.poleTime = poleTime;
		this.polePosition = polePosition;
		this.raceFastLap = raceFastLap;
		this.racePosition = racePosition;
		this.retirement = retirement;
		this.fastestLap = fastestLap;
		this.session = session;
		if (racePosition >= 900) {
			if (racePosition == 900) {
				this.raceStatus = "DNF";
			} else if (racePosition == 901) {
				this.raceStatus = "DNS";
			} else if (racePosition == 902){
				this.raceStatus = "DSQ";
			} else {
				this.raceStatus = "NC";
			}
		}
	}

	public String getRaceNumber() {
		return raceNumber;
	}

	public String getEntryName() {
		return entryName;
	}

	public long getDriverId() {
		return driverId;
	}

	public long getEventEditionId() {
		return eventEditionId;
	}

	public String getDriverName() {
		return driverName;
	}

	public String getEventName() {
		return eventName;
	}

	public String getChassisEngine() {
		return chassisEngine;
	}

	public Integer getEditionYear() {
		return editionYear;
	}

	public Long getPoleTime() {
		return poleTime;
	}

	public Integer getPolePosition() {
		return polePosition;
	}

	public Long getRaceFastLap() {
		return raceFastLap;
	}

	public Integer getRacePosition() {
		return racePosition;
	}

	public String getRetirement() {
		return retirement;
	}

	public Long getFastestLap() {
		return fastestLap;
	}

	public String getSession() {
		return session;
	}

	public String getRaceStatus() {
		return raceStatus;
	}
}

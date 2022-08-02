package com.icesoft.msdb.service.dto;

import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Optional;

import com.icesoft.msdb.domain.Engine;
import com.icesoft.msdb.domain.EventEditionEntry;
import lombok.Getter;
import lombok.Setter;

@Getter
public class EventEntrySearchResultDTO {
	private String raceNumber;
	private String entryName;
	private long driverId = -1;
	private Long eventEditionId;
    @Setter
	private LocalDate sessionDate;
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

	public EventEntrySearchResultDTO(EventEditionEntry entry, LocalDate sessionDate, Long poleTime, Long raceFastLap, Integer polePosition,
			Integer racePosition, String retirement) {
		this.raceNumber = entry.getRaceNumber();
		this.entryName = entry.getEntryName();
		this.sessionDate = sessionDate;
		this.eventEditionId = entry.getEventEdition().getId();
		this.editionYear = entry.getEventEdition().getEditionYear();
		this.eventName = entry.getEventEdition().getLongEventName();
		if (!entry.getEventEdition().isMultidriver()) {
			this.driverId = entry.getDrivers().stream().findFirst().get().getDriver().getId();
		}
		this.driverName = entry.getDriversName();
		chassisEngine = String.format("%s %s",
				entry.getChassis().getManufacturer(),
				entry.getChassis().getName());
		if (entry.getEngine() != null) {
			Double capacity = new java.math.BigDecimal(Optional.ofNullable(entry.getEngine()).orElse(new Engine()).getCapacity() / 1000d)
					.setScale(1, RoundingMode.HALF_UP).doubleValue();
			chassisEngine.concat(String.format("/%s %s %s %s",
					entry.getEngine().getManufacturer(),
					entry.getEngine().getName(),
					capacity,
					entry.getEngine().getArchitecture()));
		}

		this.poleTime = poleTime;
		this.polePosition = polePosition;
		this.raceFastLap = raceFastLap;
		this.racePosition = racePosition;
		this.retirement = retirement;
		if (racePosition >= 900) {
			if (racePosition == 900) {
				this.raceStatus = "DNF";
			} else if (racePosition == 901) {
				this.raceStatus = "DNS";
			} else if (racePosition == 902){
				this.raceStatus = "DSQ";
			}
		}
		if (racePosition == 800) {
			this.raceStatus = "NC";
		}
	}
}

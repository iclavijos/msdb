package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class EventEditionImportDTO {

	private String seriesEditionName;
	private String eventName;
	private String longEventEditionName;
	private String shortEventName;
	@JsonFormat(pattern="dd/MM/yyyy")
	private LocalDate eventDate;
	private String racetrackName;
	private String layoutName;
	private String categories;
	private Boolean multipleDriversEntry;
	private String sessionName;
	private String sessionShortName;
	@JsonFormat(pattern="dd/MM/yyyy HH:mm", timezone="UTC")
	private LocalDateTime sessionStartTime;
	private Float sessionDuration;
	private String durationType;
	private Boolean extraLap;
	private String sessionType;
	private Integer maxDuration;
	private String pointsSystem;

}

package com.icesoft.msdb.domain.stats;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Result {

	Integer order;
	Long eventEditionId;
	String eventName;
	Integer year;
	LocalDate eventDate;
	Integer position;
	Integer gridPosition;
	Integer lapsLed;
	Boolean grandChelem;
}

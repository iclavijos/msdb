package com.icesoft.msdb.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class EventsSeriesNavigationDTO {

	private final Long prevId;
	private final Long nextId;
	private final String prevName;
	private final String nextName;

}

package com.icesoft.msdb.service.dto;

public class EventsSeriesNavigationDTO {

	private final Long prevId;
	private final Long nextId;
	private final String prevName;
	private final String nextName;

	public EventsSeriesNavigationDTO(Long prevId, Long nextId, String prevName, String nextName) {
		super();
		this.prevId = prevId;
		this.nextId = nextId;
		this.prevName = prevName;
		this.nextName = nextName;
	}

	public Long getPrevId() {
		return prevId;
	}

	public Long getNextId() {
		return nextId;
	}

	public String getPrevName() {
		return prevName;
	}

	public String getNextName() {
		return nextName;
	}

}

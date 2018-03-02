package com.icesoft.msdb.service.dto;

public class EventsSeriesNavigationDTO {

	private final Long prevId;
	private final Long nextId;
	private final String prev_name;
	private final String next_name;
	
	public EventsSeriesNavigationDTO(Long prevId, Long nextId, String prev_name, String next_name) {
		super();
		this.prevId = prevId;
		this.nextId = nextId;
		this.prev_name = prev_name;
		this.next_name = next_name;
	}

	public Long getPrevId() {
		return prevId;
	}

	public Long getNextId() {
		return nextId;
	}

	public String getPrevName() {
		return prev_name;
	}

	public String getNextName() {
		return next_name;
	}
	
}

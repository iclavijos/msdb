package com.icesoft.msdb.service.dto;

public class EventsSeriesNavigationDTO {

	private final Integer prevId;
	private final Integer nextId;
	private final String prev_name;
	private final String next_name;
	
	public EventsSeriesNavigationDTO(Integer prevId, Integer nextId, String prev_name, String next_name) {
		super();
		this.prevId = prevId;
		this.nextId = nextId;
		this.prev_name = prev_name;
		this.next_name = next_name;
	}

	public Integer getPrevId() {
		return prevId;
	}

	public Integer getNextId() {
		return nextId;
	}

	public String getPrevName() {
		return prev_name;
	}

	public String getNextName() {
		return next_name;
	}
	
}

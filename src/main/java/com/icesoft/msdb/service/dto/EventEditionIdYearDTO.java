package com.icesoft.msdb.service.dto;

public class EventEditionIdYearDTO {

	private final Long id;
	private final Integer editionYear;
	
	public EventEditionIdYearDTO(Long id, Integer editionYear) {
		this.id = id;
		this.editionYear = editionYear;
	}
	
	public Long getId() {
		return id;
	}
	
	public Integer getEditionYear() {
		return editionYear;
	}
}

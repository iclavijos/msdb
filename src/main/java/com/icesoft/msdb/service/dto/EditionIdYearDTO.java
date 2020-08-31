package com.icesoft.msdb.service.dto;

public class EditionIdYearDTO {

	private final Long id;
	private final Object editionYear;

	public EditionIdYearDTO(Long id, Object editionYear) {
		this.id = id;
		this.editionYear = editionYear;
	}

	public Long getId() {
		return id;
	}

	public Object getEditionYear() {
		return editionYear;
	}
}

package com.icesoft.msdb.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ManufacturerPointsDTO {

	private final String manufacturerName;
	private final Float points;
	private final String category;

}

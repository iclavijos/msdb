package com.icesoft.msdb.service.dto;

import java.util.List;

import com.icesoft.msdb.domain.TimeZone;
import lombok.Data;

@Data
public class TimeZonesResponse {
	private String status;
	private String message;
	private List<TimeZone> zones;

}

package com.icesoft.msdb.service.dto;

public class EventRacePointsDTO {
	
	private Long raceId;
	private Long pSystemAssigned;

	public Long getRaceId() {
		return raceId;
	}

	public void setRaceId(Long raceId) {
		this.raceId = raceId;
	}

	public Long getpSystemAssigned() {
		return pSystemAssigned;
	}

	public void setpSystemAssigned(Long pSystemAssigned) {
		this.pSystemAssigned = pSystemAssigned;
	}
	
	public boolean isAssigned() {
		return pSystemAssigned != null;
	}
		
}

package com.icesoft.msdb.service.dto;

public class TeamPointsDTO {

	private final Long teamId;
	private final String teamName;
	private final Float points;
	
	public TeamPointsDTO(Long teamId, String teamName, Float points) {
		super();
		this.teamId = teamId;
		this.teamName = teamName;
		this.points = points;
	}

	public Long getTeamId() {
		return teamId;
	}

	public String getTeamName() {
		return teamName;
	}

	public Float getPoints() {
		return points;
	}
	
}

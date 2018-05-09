package com.icesoft.msdb.service.dto;

public class TeamPointsDTO {

	private final Long teamId;
	private final String teamName;
	private final Float points;
	private final String category;

	public TeamPointsDTO(Long teamId, String teamName, Float points, String category) {
		super();
		this.teamId = teamId;
		this.teamName = teamName;
		this.points = points;
		this.category = category;
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

	public String getCategory() { return category; }

}

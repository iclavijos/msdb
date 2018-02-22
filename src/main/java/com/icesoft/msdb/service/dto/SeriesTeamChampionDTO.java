package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Team;

public class SeriesTeamChampionDTO {
	
	private static final String CHAMPION_IMAGE_URL_TEMPLATE = "https://res.cloudinary.com/msdb-cloud/image/upload/w_160/l_team:%s,w_120,c_thumb,y_-7/crown.png";

	private String teamName;
	private Long teamId;
	
	public SeriesTeamChampionDTO(Team team) {
		this.teamName = team.getName();
		this.teamId = team.getId();
	}
	
	public String getTeamName() {
		return teamName;
	}
	public Long getTeamId() {
		return teamId;
	}
	public String getTeamImage() {
		return String.format(CHAMPION_IMAGE_URL_TEMPLATE, this.teamId);
	}
	
}

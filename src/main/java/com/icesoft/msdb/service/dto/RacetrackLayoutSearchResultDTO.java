package com.icesoft.msdb.service.dto;

import org.apache.commons.lang3.StringUtils;

import com.icesoft.msdb.domain.RacetrackLayout;

public class RacetrackLayoutSearchResultDTO {

	private final RacetrackLayout layout;
	
	public RacetrackLayoutSearchResultDTO(RacetrackLayout layout) {
		this.layout = layout;
	}
	
	public Long getId() {
		return layout.getId();
	}
	
	public String getLayoutImg() {
		String url = layout.getLayoutImageUrl();
		if (StringUtils.isBlank(url)) {
			return null;
		}
		int pos = url.indexOf("/upload/");
		url = url.substring(0, pos + 8) + "w_100/" + url.substring(pos + 8);
		return url;
	}
	
	public String getFullName() {
		return layout.getRacetrack().getName() + " - " + layout.getName();
	}
}

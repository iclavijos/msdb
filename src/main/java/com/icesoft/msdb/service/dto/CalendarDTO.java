package com.icesoft.msdb.service.dto;

import java.util.List;

import com.icesoft.msdb.domain.EventSession;

public class CalendarDTO {

	private String date;
	private List<EventSession> sessions;
	
	public CalendarDTO(String date, List<EventSession> sessions) {
		this.date = date;
		this.sessions = sessions;
	}

	public String getDate() {
		return date;
	}

	public List<EventSession> getSessions() {
		return sessions;
	}
	
}

package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.util.List;

import com.icesoft.msdb.domain.EventSession;

public class CalendarDTO {

	private LocalDate date;
	private List<EventSession> sessions;
	
	public CalendarDTO(LocalDate date, List<EventSession> sessions) {
		this.date = date;
		this.sessions = sessions;
	}

	public LocalDate getDate() {
		return date;
	}

	public List<EventSession> getSessions() {
		return sessions;
	}
	
}

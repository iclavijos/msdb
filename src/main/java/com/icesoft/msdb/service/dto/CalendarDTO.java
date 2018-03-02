package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.icesoft.msdb.domain.EventSession;

public class CalendarDTO {
	
	class SessionDataDTO {
		private final String sessionName;
		private final ZonedDateTime sessionStartTime;
		private final ZonedDateTime sessionEndTime;
		private final Integer duration;
		private final Integer durationType;
		private final Long eventEditionId;
		private final String eventName;
		private final List<Long> seriesIds;
		private final List<String> seriesNames;
		
		protected SessionDataDTO(EventSession session) {
			this.sessionName = session.getName();
			this.sessionStartTime = session.getSessionStartTime();
			this.sessionEndTime = session.getSessionEndTime();
			this.duration = session.getDuration();
			this.durationType = session.getDurationType();
			this.eventEditionId = session.getEventEdition().getId();
			this.eventName = session.getEventEdition().getLongEventName();
			this.seriesIds = session.getSeriesIds();
			this.seriesNames = session.getSeriesNames();
		}
		
		public ZonedDateTime getSessionStartTime() {
			return sessionStartTime;
		}

		public String getSessionName() {
			return sessionName;
		}

		public ZonedDateTime getSessionEndTime() {
			return sessionEndTime;
		}

		public Integer getDuration() {
			return duration;
		}

		public Integer getDurationType() {
			return durationType;
		}

		public Long getEventEditionId() {
			return eventEditionId;
		}

		public String getEventName() {
			return eventName;
		}

		public List<Long> getSeriesIds() {
			return seriesIds;
		}

		public List<String> getSeriesNames() {
			return seriesNames;
		}
	}

	private LocalDate date;
	private List<SessionDataDTO> sessionsData;
	
	public CalendarDTO(LocalDate date, List<EventSession> sessions) {
		this.date = date;
		this.sessionsData = sessions.parallelStream()
				.map(SessionDataDTO::new)
				.sorted((s1, s2) -> s1.getSessionStartTime().compareTo(s2.getSessionStartTime()))
				.collect(Collectors.toList());
	}

	public LocalDate getDate() {
		return date;
	}

	public List<SessionDataDTO> getSessions() {
		return sessionsData;
	}
	
}

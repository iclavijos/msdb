package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "CALENDAR_SESSION")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class CalendarSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
	private CalendarSessionPK id;

	@ManyToOne
    @MapsId("series_edition_id")
    @JoinColumn(name = "SERIES_EDITION_ID")
	@JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private SeriesEdition seriesEdition;

    @ManyToOne
    @MapsId("session_id")
    @JoinColumn(name = "SESSION_ID")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private EventSession eventSession;

    @Column(name="calendar_id")
    private String calendarId;

	public CalendarSession(SeriesEdition seriesEdition, EventSession eventSession) {
		this.seriesEdition = seriesEdition;
		this.eventSession = eventSession;
		this.id = new CalendarSessionPK(eventSession.getId(), seriesEdition.getId());
	}

}

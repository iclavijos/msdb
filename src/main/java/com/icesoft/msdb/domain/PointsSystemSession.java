package com.icesoft.msdb.domain;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;

@Entity
@Table(name = "POINTS_SYSTEM_SESSION")
public class PointsSystemSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
	private PointsSystemSessionPK id;

	@ManyToOne
    @MapsId("series_edition_id")
    @JoinColumn(name = "SERIES_EDITION_ID")
	@JsonIgnore
    private SeriesEdition seriesEdition;

    @ManyToOne
    @MapsId("session_id")
    @JoinColumn(name = "SESSION_ID")
    @JsonIgnore
    private EventSession eventSession;

    @ManyToOne
    private PointsSystem pointsSystem;

    @Column(name="ps_multiplier")
    private Float psMultiplier = 1.0f;

	public PointsSystemSession() {
		super();
	}

	public PointsSystemSession(PointsSystem pointsSystem, SeriesEdition seriesEdition, EventSession eventSession) {
		this.pointsSystem = pointsSystem;
		this.seriesEdition = seriesEdition;
		this.eventSession = eventSession;
		this.id = new PointsSystemSessionPK(eventSession.getId(), seriesEdition.getId());
	}

	public PointsSystemSessionPK getId() {
		return id;
	}

	public void setId(PointsSystemSessionPK id) {
		this.id = id;
	}

	public PointsSystem getPointsSystem() {
		return pointsSystem;
	}

	public void setPointsSystem(PointsSystem pointsSystem) {
		this.pointsSystem = pointsSystem;
	}

	public SeriesEdition getSeriesEdition() {
		return seriesEdition;
	}

	public void setSeriesEdition(SeriesEdition seriesEdition) {
		this.seriesEdition = seriesEdition;
	}

	public EventSession getEventSession() {
		return eventSession;
	}

	public void setEventSession(EventSession eventSession) {
		this.eventSession = eventSession;
	}

	public Float getPsMultiplier() {
		return psMultiplier;
	}

	public void setPsMultiplier(Float psMultiplier) {
		this.psMultiplier = psMultiplier;
	}

	@Override
	public String toString() {
		return "PointsSystemSession [id=" + id + ", seriesEdition=" + seriesEdition + ", eventSession=" + eventSession
				+ ", pointsSystem=" + pointsSystem + ", psMultiplier=" + psMultiplier + "]";
	}

}

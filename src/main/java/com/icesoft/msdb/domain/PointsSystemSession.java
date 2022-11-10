package com.icesoft.msdb.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;

@Entity
@Table(name = "POINTS_SYSTEM_SESSION")
@Data
@EqualsAndHashCode(callSuper = false)
public class PointsSystemSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
	private PointsSystemSessionPK id;

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

    @ManyToOne
    @MapsId("points_system_id")
    @JoinColumn(name = "POINTS_SYSTEM_ID")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
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
		this.id = new PointsSystemSessionPK(eventSession.getId(), seriesEdition.getId(), pointsSystem.getId());
	}

}

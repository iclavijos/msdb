package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "team_event_points")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TeamEventPoints implements Serializable {

	private static final long serialVersionUID = 5979343790004806638L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@ManyToOne
	private Team team;

	@ManyToOne
	private EventSession session;

	@ManyToOne
	private SeriesEdition seriesEdition;

	@Column
	private Float points = 0f;

    @ManyToOne
    private Category category;

    @Column
    private String reason;

	public Team getTeam() {
		return team;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public EventSession getSession() {
		return session;
	}

	public void setSession(EventSession session) {
		this.session = session;
	}

	public SeriesEdition getSeriesEdition() {
		return seriesEdition;
	}

	public void setSeriesEdition(SeriesEdition seriesEdition) {
		this.seriesEdition = seriesEdition;
	}

	public Float getPoints() {
		return points;
	}

	public void setPoints(Float points) {
		this.points = points;
	}

	public void addPoints(Float points) {
		this.points += points;
	}

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TeamEventPoints driverPoints = (TeamEventPoints) o;
        if (driverPoints.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, driverPoints.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}

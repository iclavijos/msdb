package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;

/**
 * A PointsSystem.
 */
@Entity
@Table(name = "points_system")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "pointssystem")
public class PointsSystem extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    private String description;

    @Column(name = "points")
    private String points;

    @Column(name = "points_most_lead_laps")
    private Integer pointsMostLeadLaps;

    @Column(name = "points_pole")
    private Integer pointsPole;

    @Column(name = "points_lead_lap")
    private Integer pointsLeadLap;

    @Column(name = "points_fast_lap")
    private Integer pointsFastLap;

    //Maximum finishing position to get points for fast lap
    @Column(name = "max_pos_fast_lap")
    private Integer maxPosFastLap = 9999;

    //Minimum percentage of the race to be completed to award points for fast lap
    @Column(name = "pct_completed_fl")
    private Integer pctCompletedFL = 0;

    //If started from pitlane, award points for fast lap?
    @Column(name = "pitlane_start_allowed")
    private Boolean pitlaneStartAllowed = false;

    @Column(name = "race_pct_completed_total_points")
    private Integer racePctCompleted;

    @Column(name = "pct_total_points")
    private Integer pctTotalPoints;

    @Column(name="active")
    private Boolean active;

    public Boolean isActive() {
		return active;
	}

    public PointsSystem active(Boolean active) {
    	this.active = active;
    	return this;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
	public void setActive(Boolean active) {
		this.active = active;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public PointsSystem name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public PointsSystem description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPoints() {
        return points;
    }

    @Transient
    public float[] disclosePoints() {
    	String[] tmp = StringUtils.remove(points, " ").split(",");
    	float[] result = new float[tmp.length];
		for(int i = 0; i < result.length; i++) {
			result[i] = Float.parseFloat(tmp[i]);
		}
		return result;
    }

    public PointsSystem points(String points) {
        this.points = points;
        return this;
    }

    public void setPoints(String points) {
        this.points = points;
    }

    public Integer getPointsMostLeadLaps() {
        return pointsMostLeadLaps;
    }

    public PointsSystem pointsMostLeadLaps(Integer pointsMostLeadLaps) {
        this.pointsMostLeadLaps = pointsMostLeadLaps;
        return this;
    }

    public void setPointsMostLeadLaps(Integer pointsMostLeadLaps) {
        this.pointsMostLeadLaps = pointsMostLeadLaps;
    }

    public Integer getPointsPole() {
        return pointsPole;
    }

    public PointsSystem pointsPole(Integer pointsPole) {
        this.pointsPole = pointsPole;
        return this;
    }

    public void setPointsPole(Integer pointsPole) {
        this.pointsPole = pointsPole;
    }

    public Integer getPointsFastLap() {
		return pointsFastLap;
	}

    public void setPointsFastLap(Integer pointsFastLap) {
        this.pointsFastLap = pointsFastLap;
    }

    public PointsSystem pointsFastLap(Integer pointsFastLap) {
    	this.pointsFastLap = pointsFastLap;
    	return this;
    }

	public Integer getMaxPosFastLap() {
		return maxPosFastLap;
	}

	public PointsSystem maxPosFastLap(Integer maxPosFastLap) {
		this.maxPosFastLap = maxPosFastLap;
		return this;
	}

	public void setMaxPosFastLap(Integer maxPosFastLap) {
		this.maxPosFastLap = maxPosFastLap;
	}

	public Integer getPctCompletedFL() {
		return pctCompletedFL;
	}

    public PointsSystem pctCompletedFL(Integer pctCompleted) {
    	this.pctCompletedFL = pctCompleted;
    	return this;
    }

	public void setPctCompletedFL(Integer pctCompleted) {
		this.pctCompletedFL = pctCompleted;
	}

	public Boolean isPitlaneStartAllowed() {
		return pitlaneStartAllowed;
	}

	public PointsSystem pitlaneStartAllowed(Boolean pitlaneStartAllowed) {
		this.pitlaneStartAllowed = pitlaneStartAllowed;
		return this;
	}

	public void setPitlaneStartAllowed(Boolean pitlaneStartAllowed) {
		this.pitlaneStartAllowed = pitlaneStartAllowed;
	}

    public Integer getPointsLeadLap() {
        return pointsLeadLap;
    }

    public PointsSystem pointsLeadLap(Integer pointsLeadLap) {
        this.pointsLeadLap = pointsLeadLap;
        return this;
    }

    public void setPointsLeadLap(Integer pointsLeadLap) {
        this.pointsLeadLap = pointsLeadLap;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    public Integer getRacePctCompleted() {
		return racePctCompleted;
	}

    public PointsSystem racePctCompleted(Integer racePctCompleted) {
		this.racePctCompleted = racePctCompleted;
		return this;
	}

	public void setRacePctCompleted(Integer racePctCompleted) {
		this.racePctCompleted = racePctCompleted;
	}

	public Integer getPctTotalPoints() {
		return pctTotalPoints;
	}

	public PointsSystem pctTotalPoints(Integer pctTotalPoints) {
		this.pctTotalPoints = pctTotalPoints;
		return this;
	}

	public void setPctTotalPoints(Integer pctTotalPoints) {
		this.pctTotalPoints = pctTotalPoints;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PointsSystem)) {
            return false;
        }
        return id != null && id.equals(((PointsSystem) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PointsSystem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", points='" + getPoints() + "'" +
            ", pointsMostLeadLaps=" + getPointsMostLeadLaps() +
            ", pointsFastLap=" + getPointsFastLap() +
            ", pointsPole=" + getPointsPole() +
            ", pointsLeadLap=" + getPointsLeadLap() +
            "}";
    }
}

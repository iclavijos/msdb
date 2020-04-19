package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.*;

import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.SessionType;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.*;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * A EventSession.
 */
@Entity
@Table(name = "event_session")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class EventSession extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    private String shortname;

    @NotNull
    @Column(name = "session_start_time", nullable = false)
    private ZonedDateTime sessionStartTime;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "max_duration")
    private Integer maxDuration;

    @Column(name= "duration_type")
    private Integer durationType;

    @Column(name= "session_type")
    @Enumerated(EnumType.ORDINAL)
    private SessionType sessionType;

    @Column(name= "additional_lap")
    private Boolean additionalLap;

    @ManyToOne
    private EventEdition eventEdition;

    @OneToMany(mappedBy = "eventSession", cascade=CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @NotFound(action = NotFoundAction.IGNORE)
    private List<PointsSystemSession> pointsSystemsSession = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public EventSession name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortname() {
        return shortname;
    }

    public EventSession shortname(String shortname) {
        this.shortname = shortname;
        return this;
    }

    public void setShortname(String shortname) {
        this.shortname = shortname;
    }

    public ZonedDateTime getSessionStartTime() {
        return sessionStartTime;
    }

    public EventSession sessionStartTime(ZonedDateTime sessionStartTime) {
        this.sessionStartTime = sessionStartTime;
        return this;
    }

    public void setSessionStartTime(ZonedDateTime sessionStartTime) {
        this.sessionStartTime = sessionStartTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public EventSession duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getMaxDuration() {
		return maxDuration;
	}

    public EventSession maxDuration(Integer maxDuration) {
    	this.maxDuration = maxDuration;
    	return this;
    }

	public void setMaxDuration(Integer maxDuration) {
		this.maxDuration = maxDuration;
	}

	public Integer getDurationType() {
		return durationType;
	}

    public EventSession durationType(Integer durationType) {
    	this.durationType = durationType;
    	return this;
    }

	public void setDurationType(Integer durationType) {
		this.durationType = durationType;
	}

	public SessionType getSessionType() {
		return sessionType;
	}

	public void setSessionType(SessionType sessionType) {
		this.sessionType = sessionType;
	}

	public EventSession sessionType(SessionType sessionType) {
		this.sessionType = sessionType;
		return this;
	}

	public int getSessionTypeValue() {
		return sessionType.getValue() - 1;
	}

	public boolean isRace() {
		return sessionType.equals(SessionType.RACE);
	}

	public Boolean getAdditionalLap() {
		return additionalLap;
	}

	public void setAdditionalLap(Boolean additionalLap) {
		this.additionalLap = additionalLap;
	}

	public EventSession additionalLap(Boolean additionalLap) {
		this.additionalLap = additionalLap;
		return this;
	}

	public void setEventEdition(EventEdition eventEdition) {
    	this.eventEdition = eventEdition;
    }

	public List<PointsSystemSession> addPointsSystemsSession(PointsSystemSession pss) {
		if (pointsSystemsSession == null) {
			pointsSystemsSession = new ArrayList<>();
		}
		pointsSystemsSession.add(pss);
		return pointsSystemsSession;
	}

    public List<PointsSystemSession> getPointsSystemsSession() {
		return pointsSystemsSession;
	}

	public void setPointsSystemsSession(List<PointsSystemSession> pointsSystemsSession) {
		this.pointsSystemsSession = pointsSystemsSession;
	}

	public EventSession eventEdition(EventEdition eventEdition) {
    	this.eventEdition = eventEdition;
    	return this;
    }

    public EventEdition getEventEdition() {
    	return eventEdition;
    }

	public List<Long> getSeriesIds() {
		if (eventEdition!= null && eventEdition.getSeriesEditions() != null) {
			return eventEdition.getSeriesId();
		}
		return null;
	}

	public List<String> getSeriesNames() {
		if (eventEdition!= null && eventEdition.getSeriesEditions() != null) {
			return eventEdition.getSeriesName();
		}
		return null;
	}

	public boolean isFinished(ZonedDateTime now) {
		return getSessionEndTime().isBefore(ZonedDateTime.now(ZoneId.of("UTC")));
	}

	public ZonedDateTime getSessionEndTime() {
		DurationType durationType = DurationType.valueOf(getDurationType());
		TemporalUnit temp = durationType.equals(DurationType.MINUTES) ? ChronoUnit.MINUTES :
				durationType.equals(DurationType.HOURS) ? ChronoUnit.HOURS : null;

		int maxDuration = Optional.ofNullable(getMaxDuration()).orElse(new Integer(0));

		if (maxDuration > 0) {
			return getSessionStartTime().plus(maxDuration, ChronoUnit.HOURS);
		}

		if (!getSessionType().equals(SessionType.RACE)) {
			return getSessionStartTime().plus(getDuration(), temp);
		} else {
			if (temp != null) {
				return getSessionStartTime().plus(getDuration(), temp);
			} else {
				return getSessionStartTime().plus(2, ChronoUnit.HOURS);
			}
		}

	}

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventSession)) {
            return false;
        }
        return id != null && id.equals(((EventSession) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventSession{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", shortname='" + getShortname() + "'" +
            ", sessionStartTime='" + getSessionStartTime() + "'" +
            ", duration='" + getDuration() + "'" +
            ", durationType='" + getDurationType() + "'" +
            ", sessionType='" + getSessionType() + "'" +
            ", additionalLap='" + getAdditionalLap() + "'" +
            '}';
    }
}

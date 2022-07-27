package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.*;

import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.repository.converter.DurationTypeConverter;
import com.icesoft.msdb.repository.converter.SessionTypeConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * A EventSession.
 */
@Entity
@Table(name = "event_session")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data @EqualsAndHashCode(callSuper=false)
public class EventSession extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Column(name = "start_time_ts", nullable = false)
    private Long sessionStartTime;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Float duration;

    @Column(name = "total_duration")
    private Float totalDuration;

    @Column(name = "max_duration")
    private Integer maxDuration;

    @Column(name= "duration_type")
    @Convert(converter = DurationTypeConverter.class)
    private DurationType durationType;

    @Column(name= "session_type")
    @Convert(converter = SessionTypeConverter.class)
    private SessionType sessionType;

    @Column(name= "additional_lap")
    private Boolean additionalLap;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    private EventEdition eventEdition;

    @OneToMany(mappedBy = "eventSession", cascade=CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @NotFound(action = NotFoundAction.IGNORE)
    @EqualsAndHashCode.Exclude
    private List<PointsSystemSession> pointsSystemsSession = new ArrayList<>();

    @JsonIgnore
    public ZonedDateTime getSessionStartTimeDate() {
        return ZonedDateTime.ofInstant(Instant.ofEpochSecond(getSessionStartTime()), ZoneId.of("UTC"));
    }

    @Column(name = "location")
    private String location;

    @Column(name = "location_time_zone")
    private String locationTimeZone;

    @Column
    private Boolean cancelled;

	public boolean isRace() {
		return sessionType.equals(SessionType.RACE);
	}

	public List<PointsSystemSession> addPointsSystemsSession(PointsSystemSession pss) {
		if (pointsSystemsSession == null) {
			pointsSystemsSession = new ArrayList<>();
		}
		pointsSystemsSession.add(pss);
		return pointsSystemsSession;
	}

	public List<Long> getSeriesIds() {
		if (eventEdition!= null && eventEdition.getSeriesEditions() != null) {
			return eventEdition.getSeriesEditions().stream()
                .map(se -> se.getId()).collect(Collectors.toList());
		}
		return null;
	}

	public List<String> getSeriesNames() {
		if (eventEdition!= null && eventEdition.getSeriesEditions() != null) {
			return eventEdition.getSeriesEditions().stream()
                .map(se -> se.getEditionName()).collect(Collectors.toList());
		}
		return null;
	}

	public boolean isFinished(ZonedDateTime now) {
		return getSessionEndTime().isBefore(ZonedDateTime.now(ZoneId.of("UTC")));
	}

	public ZonedDateTime getSessionEndTime() {
		TemporalUnit temp = durationType.equals(DurationType.MINUTES) ? ChronoUnit.MINUTES :
				durationType.equals(DurationType.HOURS) ? ChronoUnit.HOURS : null;

		int maxDuration = Optional.ofNullable(getMaxDuration()).orElse(0);

		if (maxDuration > 0) {
			return getSessionStartTimeDate().plus(maxDuration, ChronoUnit.MINUTES);
		}

        if (getSessionType().equals(SessionType.STAGE)) {
            return getSessionStartTimeDate().plus(30, ChronoUnit.MINUTES);
        } else {
            if (!getSessionType().equals(SessionType.RACE)) {
                return getSessionStartTimeDate().plus(getDuration().intValue(), temp);
            } else {
                if (temp != null) {
                    return getSessionStartTimeDate().plus(getDuration().intValue(), temp);
                } else {
                    return getSessionStartTimeDate().plus(2, ChronoUnit.HOURS);
                }
            }
        }

	}

}

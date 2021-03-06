package com.icesoft.msdb.domain;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;

import javax.persistence.*;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventEntryResult.
 */
@Entity
@Table(name = "event_entry_result")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class EventEntryResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "starting_position")
    private Integer startingPosition;

    @Column(name = "final_position")
    private Integer finalPosition;

    @Column(name = "total_time")
    private Long totalTime;

    @Column(name = "best_lap_time")
    private Long bestLapTime;

    @Column(name = "laps_completed")
    private Integer lapsCompleted;

    @Column(name = "retired")
    private Boolean retired = false;

    @Column(name = "cause", length=100)
    private String cause;

    @Column(name = "difference")
    private Long difference;

    @Column(name = "difference_type")
    private Integer differenceType;

    @Column(name = "laps_led")
    private Integer lapsLed;

    @Column(name = "pitlane_start")
    private Boolean pitlaneStart = false;

    @OneToOne
    @JoinColumn(name = "shared_drive_with_id", referencedColumnName = "id")
    private EventEditionEntry sharedWith;

    @Column(name = "invalid_fastlap")
    private Boolean invalidFastlap = false;

    @ManyToOne
    private EventSession session;

    @OneToOne
    private EventEditionEntry entry;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStartingPosition() {
		return startingPosition;
	}

    public EventEntryResult startingPosition(Integer startingPosition) {
    	this.startingPosition = startingPosition;
    	return this;
    }

	public void setStartingPosition(Integer startingPosition) {
		this.startingPosition = startingPosition;
	}

	public Integer getFinalPosition() {
        return finalPosition;
    }

    public EventEntryResult finalPosition(Integer finalPosition) {
        this.finalPosition = finalPosition;
        return this;
    }

    public void setFinalPosition(Integer finalPosition) {
        this.finalPosition = finalPosition;
    }

    public Long getTotalTime() {
        return totalTime;
    }

    public EventEntryResult totalTime(Long totalTime) {
        this.totalTime = totalTime;
        return this;
    }

    public void setTotalTime(Long totalTime) {
        this.totalTime = totalTime;
    }

    public Long getBestLapTime() {
        return bestLapTime;
    }

    public EventEntryResult bestLapTime(Long bestLapTime) {
        this.bestLapTime = bestLapTime;
        return this;
    }

    public void setBestLapTime(Long bestLapTime) {
        this.bestLapTime = bestLapTime;
    }

    public Integer getLapsCompleted() {
        return lapsCompleted;
    }

    public EventEntryResult lapsCompleted(Integer lapsCompleted) {
        this.lapsCompleted = lapsCompleted;
        return this;
    }

    public void setLapsCompleted(Integer lapsCompleted) {
        this.lapsCompleted = lapsCompleted;
    }

    public Boolean isRetired() {
        return
            Optional.ofNullable(retired).orElse(Boolean.FALSE);
    }

    public EventEntryResult retired(Boolean retired) {
        this.retired = retired;
        return this;
    }

    public void setRetired(Boolean retired) {
        this.retired = retired;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    public String getCause() {
		return cause;
	}

    public EventEntryResult cause(String cause) {
    	this.cause = cause;
    	return this;
    }

	public void setCause(String cause) {
		this.cause = cause;
	}

	public Long getDifference() {
		return difference;
	}

	public EventEntryResult difference(Long difference) {
		this.difference = difference;
		return this;
	}

	public void setDifference(Long difference) {
		this.difference = difference;
	}

	public Integer getDifferenceType() {
		return differenceType;
	}

	public EventEntryResult differenceType(Integer differenceType) {
		this.differenceType = differenceType;
		return this;
	}

	public void setDifferenceType(Integer differenceType) {
		this.differenceType = differenceType;
	}

	public Integer getLapsLed() {
		if (lapsLed == null) {
			return 0;
		}
		return lapsLed;
	}

	public void setLapsLed(Integer lapsLed) {
		this.lapsLed = lapsLed;
	}

	public Boolean isPitlaneStart() {
		if (pitlaneStart == null) {
			return false;
		}
		return pitlaneStart;
	}

	public void setPitlaneStart(Boolean pitlaneStart) {
		this.pitlaneStart = pitlaneStart;
	}

	public EventEntryResult pitlaneStart(Boolean pitlaneStart) {
		this.pitlaneStart = pitlaneStart;
		return this;
	}

	public EventSession getSession() {
		return session;
	}

	public EventEntryResult session(EventSession session) {
		this.session = session;
		return this;
	}

	public void setSession(EventSession session) {
		this.session = session;
	}

	public EventEditionEntry getEntry() {
		return entry;
	}

	public EventEntryResult entry(EventEditionEntry entry) {
		this.entry = entry;
		return this;
	}

	public void setEntry(EventEditionEntry entry) {
		this.entry = entry;
	}

	public EventEditionEntry getSharedWith() {
		return sharedWith;
	}

	public EventEntryResult sharedWith(EventEditionEntry sharedWith) {
		this.sharedWith = sharedWith;
		return this;
	}

	public void setSharedWith(EventEditionEntry sharedWith) {
		this.sharedWith = sharedWith;
	}

	public void setInvalidFastlap(Boolean invalidFastlap) {
        this.invalidFastlap = invalidFastlap;
    }

    public EventEntryResult invalidFastlap(Boolean invalidFastlap) {
        setInvalidFastlap(invalidFastlap);
        return this;
    }

    public Boolean isInvalidFastlap() {
        return invalidFastlap;
    }

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventEntryResult)) {
            return false;
        }
        return id != null && id.equals(((EventEntryResult) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventEntryResult{" +
            "id=" + getId() +
            ", finalPosition=" + getFinalPosition() +
            ", totalTime=" + getTotalTime() +
            ", bestLapTime=" + getBestLapTime() +
            ", lapsCompleted=" + getLapsCompleted() +
            ", retired='" + isRetired() + "'" +
            ", difference='" + getDifference() + "'" +
            "}";
    }
}

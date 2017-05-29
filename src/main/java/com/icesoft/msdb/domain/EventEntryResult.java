package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.web.rest.view.MSDBView;

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
    @JsonView(MSDBView.SessionResultsView.class)
    private Long id;

    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "starting_position")
    private Integer startingPosition;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "final_position")
    private Integer finalPosition;

    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "total_time")
    private Long totalTime;

    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "best_lap_time")
    private Long bestLapTime;

    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "laps_completed")
    private Integer lapsCompleted;

    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "retired")
    private Boolean retired = false;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "cause", length=100)
    private String cause;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "difference")
    private Long difference;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "difference_type")
    private Integer differenceType;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "laps_led")
    private Integer lapsLed;
    
    @ManyToOne
    @JsonView(MSDBView.SessionResultsView.class)
    private EventSession session;
    
    @OneToOne
    @JsonView(MSDBView.SessionResultsView.class)
    private EventEditionEntry entry;

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
    	if (retired == null) {
    		retired = false;
    	}
        return retired;
    }

    public EventEntryResult retired(Boolean retired) {
        this.retired = retired;
        return this;
    }

    public void setRetired(Boolean retired) {
        this.retired = retired;
    }

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

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEntryResult eventEntryResult = (EventEntryResult) o;
        if (eventEntryResult.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, eventEntryResult.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EventEntryResult{" +
            "id=" + id +
            ", finalPosition='" + finalPosition + "'" +
            ", totalTime='" + totalTime + "'" +
            ", bestLapTime='" + bestLapTime + "'" +
            ", lapsCompleted='" + lapsCompleted + "'" +
            ", retired='" + retired + "'" +
            '}';
    }
}

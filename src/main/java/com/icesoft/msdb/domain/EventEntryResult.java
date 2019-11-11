package com.icesoft.msdb.domain;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A EventEntryResult.
 */
@Entity
@Table(name = "event_entry_result")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "evententryresult")
public class EventEntryResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "final_position")
    private Integer finalPosition;

    @Column(name = "total_time")
    private Long totalTime;

    @Column(name = "best_lap_time")
    private Long bestLapTime;

    @Column(name = "laps_completed")
    private Integer lapsCompleted;

    @Column(name = "retired")
    private Boolean retired;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return retired;
    }

    public EventEntryResult retired(Boolean retired) {
        this.retired = retired;
        return this;
    }

    public void setRetired(Boolean retired) {
        this.retired = retired;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

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
        return 31;
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
            "}";
    }
}

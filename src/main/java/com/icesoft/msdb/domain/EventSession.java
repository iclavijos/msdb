package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A EventSession.
 */
@Entity
@Table(name = "event_session")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "eventsession")
public class EventSession implements Serializable {

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

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

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
        return 31;
    }

    @Override
    public String toString() {
        return "EventSession{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", shortname='" + getShortname() + "'" +
            ", sessionStartTime='" + getSessionStartTime() + "'" +
            ", duration=" + getDuration() +
            "}";
    }
}

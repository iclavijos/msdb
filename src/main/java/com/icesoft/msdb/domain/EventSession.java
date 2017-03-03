package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventSession.
 */
@Entity
@Table(name = "event_session")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "eventsession")
public class EventSession implements Serializable {

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
    @Column(name = "session_start_time", nullable = false)
    private ZonedDateTime sessionStartTime;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventSession eventSession = (EventSession) o;
        if (eventSession.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, eventSession.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EventSession{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", shortname='" + shortname + "'" +
            ", sessionStartTime='" + sessionStartTime + "'" +
            ", duration='" + duration + "'" +
            '}';
    }
}

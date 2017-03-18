package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "evententry")
public class EventEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "team_name", length = 100, nullable = false)
    private String teamName;

    @ManyToOne
    private Driver driver;

    @ManyToMany(mappedBy = "participations")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Team> participants = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public EventEntry teamName(String teamName) {
        this.teamName = teamName;
        return this;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Driver getDriver() {
        return driver;
    }

    public EventEntry driver(Driver driver) {
        this.driver = driver;
        return this;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Set<Team> getParticipants() {
        return participants;
    }

    public EventEntry participants(Set<Team> teams) {
        this.participants = teams;
        return this;
    }

    public EventEntry addParticipants(Team team) {
        this.participants.add(team);
        //team.getParticipations().add(this);
        return this;
    }

    public EventEntry removeParticipants(Team team) {
        this.participants.remove(team);
        //team.getParticipations().remove(this);
        return this;
    }

    public void setParticipants(Set<Team> teams) {
        this.participants = teams;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEntry eventEntry = (EventEntry) o;
        if (eventEntry.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, eventEntry.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EventEntry{" +
            "id=" + id +
            ", teamName='" + teamName + "'" +
            '}';
    }
}

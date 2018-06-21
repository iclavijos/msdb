package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "evententry")
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
    private Car car;

    @ManyToOne
    private Driver driver;

    @ManyToMany(mappedBy = "participations")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Team> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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

    public Car getCar() {
        return car;
    }

    public EventEntry car(Car car) {
        this.car = car;
        return this;
    }

    public void setCar(Car car) {
        this.car = car;
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
        team.getParticipations().add(this);
        return this;
    }

    public EventEntry removeParticipants(Team team) {
        this.participants.remove(team);
        team.getParticipations().remove(this);
        return this;
    }

    public void setParticipants(Set<Team> teams) {
        this.participants = teams;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEntry eventEntry = (EventEntry) o;
        if (eventEntry.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eventEntry.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventEntry{" +
            "id=" + getId() +
            ", teamName='" + getTeamName() + "'" +
            "}";
    }
}

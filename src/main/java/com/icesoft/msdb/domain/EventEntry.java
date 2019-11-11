package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "evententry")
public class EventEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "team_name", length = 100, nullable = false)
    private String teamName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("eventEntries")
    private Car car;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("eventEntries")
    private Driver driver;

    @ManyToMany(mappedBy = "participations")
    @JsonIgnore
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
        if (!(o instanceof EventEntry)) {
            return false;
        }
        return id != null && id.equals(((EventEntry) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "EventEntry{" +
            "id=" + getId() +
            ", teamName='" + getTeamName() + "'" +
            "}";
    }
}

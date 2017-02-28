package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Driver.
 */
@Entity
@Table(name = "driver")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "driver")
public class Driver implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    private String name;

    @NotNull
    @Size(max = 60)
    @Column(name = "surname", length = 60, nullable = false)
    private String surname;

    @NotNull
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Size(max = 75)
    @Column(name = "birth_place", length = 75)
    private String birthPlace;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Size(max = 75)
    @Column(name = "death_place", length = 75)
    private String deathPlace;

    @Lob
    @Column(name = "portrait")
    private byte[] portrait;

    @Column(name = "portrait_content_type")
    private String portraitContentType;

    @OneToMany(mappedBy = "driver")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<EventEntry> participations = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Driver name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public Driver surname(String surname) {
        this.surname = surname;
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public Driver birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public Driver birthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
        return this;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public LocalDate getDeathDate() {
        return deathDate;
    }

    public Driver deathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
        return this;
    }

    public void setDeathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
    }

    public String getDeathPlace() {
        return deathPlace;
    }

    public Driver deathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
        return this;
    }

    public void setDeathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
    }

    public byte[] getPortrait() {
        return portrait;
    }

    public Driver portrait(byte[] portrait) {
        this.portrait = portrait;
        return this;
    }

    public void setPortrait(byte[] portrait) {
        this.portrait = portrait;
    }

    public String getPortraitContentType() {
        return portraitContentType;
    }

    public Driver portraitContentType(String portraitContentType) {
        this.portraitContentType = portraitContentType;
        return this;
    }

    public void setPortraitContentType(String portraitContentType) {
        this.portraitContentType = portraitContentType;
    }

    public Set<EventEntry> getParticipations() {
        return participations;
    }

    public Driver participations(Set<EventEntry> eventEntries) {
        this.participations = eventEntries;
        return this;
    }

    public Driver addParticipations(EventEntry eventEntry) {
        this.participations.add(eventEntry);
        eventEntry.setDriver(this);
        return this;
    }

    public Driver removeParticipations(EventEntry eventEntry) {
        this.participations.remove(eventEntry);
        eventEntry.setDriver(null);
        return this;
    }

    public void setParticipations(Set<EventEntry> eventEntries) {
        this.participations = eventEntries;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Driver driver = (Driver) o;
        if (driver.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, driver.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Driver{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", surname='" + surname + "'" +
            ", birthDate='" + birthDate + "'" +
            ", birthPlace='" + birthPlace + "'" +
            ", deathDate='" + deathDate + "'" +
            ", deathPlace='" + deathPlace + "'" +
            ", portrait='" + portrait + "'" +
            ", portraitContentType='" + portraitContentType + "'" +
            '}';
    }
}

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
 * A Racetrack.
 */
@Entity
@Table(name = "racetrack")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "racetrack")
public class Racetrack implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(name = "location", length = 100, nullable = false)
    private String location;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @OneToMany(mappedBy = "racetrack")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<RacetrackLayout> layouts = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Racetrack name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public Racetrack location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public byte[] getLogo() {
        return logo;
    }

    public Racetrack logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public Racetrack logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Set<RacetrackLayout> getLayouts() {
        return layouts;
    }

    public Racetrack layouts(Set<RacetrackLayout> racetrackLayouts) {
        this.layouts = racetrackLayouts;
        return this;
    }

    public Racetrack addLayouts(RacetrackLayout racetrackLayout) {
        this.layouts.add(racetrackLayout);
        racetrackLayout.setRacetrack(this);
        return this;
    }

    public Racetrack removeLayouts(RacetrackLayout racetrackLayout) {
        this.layouts.remove(racetrackLayout);
        racetrackLayout.setRacetrack(null);
        return this;
    }

    public void setLayouts(Set<RacetrackLayout> racetrackLayouts) {
        this.layouts = racetrackLayouts;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Racetrack racetrack = (Racetrack) o;
        if (racetrack.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), racetrack.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Racetrack{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", location='" + getLocation() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + logoContentType + "'" +
            "}";
    }
}

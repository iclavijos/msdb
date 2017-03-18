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
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Racetrack.
 */
@Entity
@Table(name = "racetrack")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "racetrack")
public class Racetrack extends AbstractAuditingEntity implements Serializable {

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

    @Transient
    private byte[] logo;
    
    @Column(name = "logo_url")
    private String logoUrl;

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

    public String getLogoUrl() {
    	return logoUrl;
    }
    
    public Racetrack logoUrl(String logoUrl) {
    	this.logoUrl = logoUrl;
    	return this;
    }
    
    public void setLogoUrl(String logoUrl) {
    	this.logoUrl = logoUrl;
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
        if (racetrack.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, racetrack.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Racetrack{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", location='" + location + "'" +
            ", logo='" + logo + "'" +
            ", logoUrl='" + logoUrl + "'" +
            '}';
    }
}

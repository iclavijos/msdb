package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Racetrack.
 */
@Entity
@Table(name = "racetrack")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "racetrack")
public class Racetrack extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(name = "location", length = 100, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String location;

    @NotNull
    @Size(max = 2)
    @Column(name = "country_code", length = 2, nullable = false)
    private String countryCode;

    @Column(name= "time_zone")
    private String timeZone;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @OneToMany(mappedBy = "racetrack")
    @JsonIgnore
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<RacetrackLayout> layouts = new HashSet<>();

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

    public String getCountryCode() {
		return countryCode;
	}

    public Racetrack countryCode(String countryCode) {
    	this.countryCode = countryCode;
    	return this;
    }

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Racetrack)) {
            return false;
        }
        return id != null && id.equals(((Racetrack) o).id);
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
            ", countryCode='" + getCountryCode() + "'" +
            ", latitude='" + getLatitude() + "'" +
            ", longitude='" + getLongitude() + "'" +
            ", logoUrl='" + getLogoUrl() + "'" +
            '}';
    }
}

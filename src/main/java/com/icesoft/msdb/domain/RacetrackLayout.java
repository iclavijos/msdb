package com.icesoft.msdb.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A RacetrackLayout.
 */
@Entity
@Table(name = "racetrack_layout")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "racetracklayout")
public class RacetrackLayout extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Column(name = "length", nullable = false)
    private Integer length;

    @NotNull
    private Integer yearFirstUse;

    @Transient
    private byte[] layoutImage;
    
    @Column
    private String layoutImageUrl;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    private Racetrack racetrack;

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

    public RacetrackLayout name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLength() {
        return length;
    }

    public RacetrackLayout length(Integer length) {
        this.length = length;
        return this;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getYearFirstUse() {
        return yearFirstUse;
    }

    public RacetrackLayout yearFirstUse(Integer yearFirstUse) {
        this.yearFirstUse = yearFirstUse;
        return this;
    }

    public void setYearFirstUse(Integer yearFirstUse) {
        this.yearFirstUse = yearFirstUse;
    }

    public byte[] getLayoutImage() {
        return layoutImage;
    }

    public RacetrackLayout layoutImage(byte[] layoutImage) {
        this.layoutImage = layoutImage;
        return this;
    }

    public String getLayoutImageUrl() {
    	return layoutImageUrl;
    }
    
    public RacetrackLayout layoutImageUrl(String layoutImageUrl) {
    	this.layoutImageUrl = layoutImageUrl;
    	return this;
    }
    
    public void setLayoutImageUrl(String layoutImageUrl) {
    	this.layoutImageUrl = layoutImageUrl;
    }

    public Boolean isActive() {
        return active;
    }

    public RacetrackLayout active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Racetrack getRacetrack() {
        return racetrack;
    }

    public RacetrackLayout racetrack(Racetrack racetrack) {
        this.racetrack = racetrack;
        return this;
    }

    public void setRacetrack(Racetrack racetrack) {
        this.racetrack = racetrack;
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
        RacetrackLayout racetrackLayout = (RacetrackLayout) o;
        if (racetrackLayout.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), racetrackLayout.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "RacetrackLayout{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", length='" + getLength() + "'" +
            ", yearFirstUse='" + getYearFirstUse() + "'" +
            ", layoutImageUrl='" + getLayoutImageUrl() + "'" +
            ", active='" + isActive() + "'" +
            '}';
    }
}

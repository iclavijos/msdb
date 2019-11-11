package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A RacetrackLayout.
 */
@Entity
@Table(name = "racetrack_layout")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "racetracklayout")
public class RacetrackLayout implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Column(name = "length", nullable = false)
    private Integer length;

    @NotNull
    @Column(name = "year_first_use", nullable = false)
    private Integer yearFirstUse;

    @Lob
    @Column(name = "layout_image")
    private byte[] layoutImage;

    @Column(name = "layout_image_content_type")
    private String layoutImageContentType;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("racetrackLayouts")
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

    public void setLayoutImage(byte[] layoutImage) {
        this.layoutImage = layoutImage;
    }

    public String getLayoutImageContentType() {
        return layoutImageContentType;
    }

    public RacetrackLayout layoutImageContentType(String layoutImageContentType) {
        this.layoutImageContentType = layoutImageContentType;
        return this;
    }

    public void setLayoutImageContentType(String layoutImageContentType) {
        this.layoutImageContentType = layoutImageContentType;
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
        if (!(o instanceof RacetrackLayout)) {
            return false;
        }
        return id != null && id.equals(((RacetrackLayout) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "RacetrackLayout{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", length=" + getLength() +
            ", yearFirstUse=" + getYearFirstUse() +
            ", layoutImage='" + getLayoutImage() + "'" +
            ", layoutImageContentType='" + getLayoutImageContentType() + "'" +
            ", active='" + isActive() + "'" +
            "}";
    }
}

package com.icesoft.msdb.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A PointsSystem.
 */
@Entity
@Table(name = "points_system")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "pointssystem")
public class PointsSystem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(name = "description", length = 100, nullable = false)
    private String description;

    @Column(name = "points")
    private Integer points;

    @Column(name = "points_most_lead_laps")
    private Integer pointsMostLeadLaps;

    @Column(name = "points_fast_lap")
    private Integer pointsFastLap;

    @Column(name = "points_pole")
    private Integer pointsPole;

    @Column(name = "points_lead_lap")
    private Integer pointsLeadLap;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public PointsSystem name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public PointsSystem description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPoints() {
        return points;
    }

    public PointsSystem points(Integer points) {
        this.points = points;
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getPointsMostLeadLaps() {
        return pointsMostLeadLaps;
    }

    public PointsSystem pointsMostLeadLaps(Integer pointsMostLeadLaps) {
        this.pointsMostLeadLaps = pointsMostLeadLaps;
        return this;
    }

    public void setPointsMostLeadLaps(Integer pointsMostLeadLaps) {
        this.pointsMostLeadLaps = pointsMostLeadLaps;
    }

    public Integer getPointsFastLap() {
        return pointsFastLap;
    }

    public PointsSystem pointsFastLap(Integer pointsFastLap) {
        this.pointsFastLap = pointsFastLap;
        return this;
    }

    public void setPointsFastLap(Integer pointsFastLap) {
        this.pointsFastLap = pointsFastLap;
    }

    public Integer getPointsPole() {
        return pointsPole;
    }

    public PointsSystem pointsPole(Integer pointsPole) {
        this.pointsPole = pointsPole;
        return this;
    }

    public void setPointsPole(Integer pointsPole) {
        this.pointsPole = pointsPole;
    }

    public Integer getPointsLeadLap() {
        return pointsLeadLap;
    }

    public PointsSystem pointsLeadLap(Integer pointsLeadLap) {
        this.pointsLeadLap = pointsLeadLap;
        return this;
    }

    public void setPointsLeadLap(Integer pointsLeadLap) {
        this.pointsLeadLap = pointsLeadLap;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PointsSystem pointsSystem = (PointsSystem) o;
        if (pointsSystem.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, pointsSystem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "PointsSystem{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", points='" + points + "'" +
            ", pointsMostLeadLaps='" + pointsMostLeadLaps + "'" +
            ", pointsFastLap='" + pointsFastLap + "'" +
            ", pointsPole='" + pointsPole + "'" +
            ", pointsLeadLap='" + pointsLeadLap + "'" +
            '}';
    }
}

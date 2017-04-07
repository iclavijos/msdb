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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SeriesEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 10)
    @Column(name = "period", length = 10, nullable = false)
    private String period;

    @Column(name = "single_chassis")
    private Boolean singleChassis;

    @Column(name = "single_engine")
    private Boolean singleEngine;

    @Column(name = "single_tyre")
    private Boolean singleTyre;

    @ManyToOne
    private Category allowedCategories; //TODO: Fix

    @ManyToOne
    private Series series;
    
    @OneToMany(mappedBy = "seriesEdition")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<EventEdition> events = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriod() {
        return period;
    }

    public SeriesEdition period(String period) {
        this.period = period;
        return this;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Boolean isSingleChassis() {
        return singleChassis;
    }

    public SeriesEdition singleChassis(Boolean singleChassis) {
        this.singleChassis = singleChassis;
        return this;
    }

    public void setSingleChassis(Boolean singleChassis) {
        this.singleChassis = singleChassis;
    }

    public Boolean isSingleEngine() {
        return singleEngine;
    }

    public SeriesEdition singleEngine(Boolean singleEngine) {
        this.singleEngine = singleEngine;
        return this;
    }

    public void setSingleEngine(Boolean singleEngine) {
        this.singleEngine = singleEngine;
    }

    public Boolean isSingleTyre() {
        return singleTyre;
    }

    public SeriesEdition singleTyre(Boolean singleTyre) {
        this.singleTyre = singleTyre;
        return this;
    }

    public void setSingleTyre(Boolean singleTyre) {
        this.singleTyre = singleTyre;
    }

    public Category getAllowedCategories() {
        return allowedCategories;
    }

    public SeriesEdition allowedCategories(Category category) {
        this.allowedCategories = category;
        return this;
    }

    public void setAllowedCategories(Category category) {
        this.allowedCategories = category;
    }
    
    public Set<EventEdition> getEvents() {
        return events;
    }

    public SeriesEdition events(Set<EventEdition> events) {
        this.events = events;
        return this;
    }

    public SeriesEdition addEvents(EventEdition eventEdition) {
        this.events.add(eventEdition);
        eventEdition.setSeriesEdition(this);
        return this;
    }

    public SeriesEdition removeEditions(EventEdition eventEdition) {
        this.events.remove(eventEdition);
        eventEdition.setSeriesEdition(null);
        return this;
    }

    public void setEvents(Set<EventEdition> eventEditions) {
        this.events = eventEditions;
    } 

    public Series getSeries() {
        return series;
    }

    public SeriesEdition series(Series series) {
        this.series = series;
        return this;
    }

    public void setSeries(Series series) {
        this.series = series;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SeriesEdition seriesEdition = (SeriesEdition) o;
        if (seriesEdition.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, seriesEdition.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "SeriesEdition{" +
            "id=" + id +
            ", period='" + period + "'" +
            ", singleChassis='" + singleChassis + "'" +
            ", singleEngine='" + singleEngine + "'" +
            ", singleTyre='" + singleTyre + "'" +
            '}';
    }
}

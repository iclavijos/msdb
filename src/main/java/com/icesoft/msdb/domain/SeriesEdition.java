package com.icesoft.msdb.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "seriesedition")
public class SeriesEdition implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 10)
    @Column(name = "period", length = 10, nullable = false)
    private String period;

    @NotNull
    @Column(name = "single_chassis", nullable = false)
    private Boolean singleChassis;

    @NotNull
    @Column(name = "single_engine", nullable = false)
    private Boolean singleEngine;

    @NotNull
    @Column(name = "single_tyre", nullable = false)
    private Boolean singleTyre;

    @ManyToOne
    @JsonIgnoreProperties("seriesEditions")
    private Category allowedCategories;

    @ManyToOne
    @JsonIgnoreProperties("editions")
    private Series series;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SeriesEdition seriesEdition = (SeriesEdition) o;
        if (seriesEdition.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), seriesEdition.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SeriesEdition{" +
            "id=" + getId() +
            ", period='" + getPeriod() + "'" +
            ", singleChassis='" + isSingleChassis() + "'" +
            ", singleEngine='" + isSingleEngine() + "'" +
            ", singleTyre='" + isSingleTyre() + "'" +
            "}";
    }
}

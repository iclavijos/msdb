package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "seriesedition")
public class SeriesEdition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("seriesEditions")
    private Category allowedCategories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("seriesEditions")
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
        if (!(o instanceof SeriesEdition)) {
            return false;
        }
        return id != null && id.equals(((SeriesEdition) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
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

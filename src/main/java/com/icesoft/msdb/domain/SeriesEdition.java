package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.web.rest.view.MSDBView;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Indexed
public class SeriesEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(MSDBView.SeriesEditionsView.class)
    private Long id;
    
    @NotNull
    @Size(max = 150)
    @Column(name = "edition_name", length = 150, nullable = false)
    @Field
    @JsonView(MSDBView.SeriesEditionsView.class)
    private String editionName;

	@NotNull
    @Size(max = 10)
    @Column(name = "period", length = 10, nullable = false)
	@JsonView(MSDBView.SeriesEditionsView.class)
    private String period;

    @Column(name = "single_chassis")
    @JsonView(MSDBView.SeriesEditionsView.class)
    private Boolean singleChassis;

    @Column(name = "single_engine")
    @JsonView(MSDBView.SeriesEditionsView.class)
    private Boolean singleEngine;

    @Column(name = "single_tyre")
    @JsonView(MSDBView.SeriesEditionsView.class)
    private Boolean singleTyre;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="CATEGORIES_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="category_id", referencedColumnName="ID"))
    @JsonView(MSDBView.SeriesEditionsView.class)
    private List<Category> allowedCategories;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="POINTS_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="points_id", referencedColumnName="ID"))
    @JsonView(MSDBView.SeriesEditionsView.class)
    private List<PointsSystem> pointsSystems;

    @ManyToOne
    @JsonView(MSDBView.SeriesEditionsView.class)
    private Series series;
    
    @OneToMany(mappedBy = "seriesEdition", fetch=FetchType.EAGER)
    @OrderBy("eventDate ASC")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonView(MSDBView.SeriesEditionDetailView.class)
    private List<EventEdition> events;

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
    
    public String getEditionName() {
		return editionName;
	}

	public void setEditionName(String editionName) {
		this.editionName = editionName;
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
    
    public List<Category> getAllowedCategories() {
        return allowedCategories;
    }

    public SeriesEdition allowedCategories(List<Category> categories) {
    	if (allowedCategories == null) {
    		this.allowedCategories = categories;
    		return this;
    	}
    	this.allowedCategories.clear();
        if (categories != null) {
        	this.allowedCategories.addAll(categories);
        }
        return this;
    }

    public void setAllowedCategories(List<Category> categories) {
    	if (allowedCategories == null) {
    		this.allowedCategories = categories;
    		return;
    	}
        this.allowedCategories.clear();
        if (categories != null) {
        	this.allowedCategories.addAll(categories);
        }
    }
    
    public List<PointsSystem> getPointsSystems() {
        return pointsSystems;
    }

    public SeriesEdition pointsSystems(List<PointsSystem> pointsSystems) {
    	if (pointsSystems == null) {
    		this.pointsSystems = pointsSystems;
    		return this;
    	}
    	this.pointsSystems.clear();
        if (pointsSystems != null) {
        	this.pointsSystems.addAll(pointsSystems);
        }
        return this;
    }

    public void setPointsSystems(List<PointsSystem> pointsSystems) {
    	this.pointsSystems = pointsSystems;
    }
    
    public List<EventEdition> getEvents() {
        return events;
    }

    public SeriesEdition events(List<EventEdition> events) {
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

    public void setEvents(List<EventEdition> eventEditions) {
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
            ", name='" + editionName + "'" +
            ", period='" + period + "'" +
            ", singleChassis='" + singleChassis + "'" +
            ", singleEngine='" + singleEngine + "'" +
            ", singleTyre='" + singleTyre + "'" +
            '}';
    }
}

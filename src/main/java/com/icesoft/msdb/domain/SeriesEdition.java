package com.icesoft.msdb.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.icesoft.msdb.MSDBException;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "seriesedition")
public class SeriesEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(max = 150)
    @Column(name = "edition_name", length = 150, nullable = false)
    private String editionName;

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
    
    @Column(name = "multidriver")
    private Boolean multidriver = false;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="CATEGORIES_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="category_id", referencedColumnName="ID"))
    private List<Category> allowedCategories;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="POINTS_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="points_id", referencedColumnName="ID"))
    private List<PointsSystem> pointsSystems;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="SERIES_DRIVERS_CHAMPIONS",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="driver_id", referencedColumnName="ID"))
    private List<Driver> driversChampions;
    
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="SERIES_TEAMS_CHAMPIONS",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="team_id", referencedColumnName="ID"))
    private List<Team> teamsChampions;

    @ManyToOne
    private Series series;
    
    @Column(name="drivers_standings")
    private Boolean driversStandings = Boolean.TRUE;
    
    @Column(name="teams_standings")
    private Boolean teamsStandings = Boolean.FALSE;
    
    @Column(name="manufacturers_standings")
    private Boolean manufacturersStandings = Boolean.FALSE;
    
    @Column(name="num_events", nullable=false)
    private Integer numEvents;

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
    
    public String getPeriodEnd() {
    	Pattern p = Pattern.compile("[0-9]{4}");
    	Matcher m = p.matcher(this.period);
    	if (m.matches()) {
    		return this.period;
    	} else {
    		p = Pattern.compile("[0-9]{4}.([0-9]{4})");
    		m = p.matcher(this.period);
    		if (m.matches()) {
    			return m.group(1);
    		} else {
    			throw new MSDBException("Invalid series period defined");
    		}
    	}
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
    
    public Boolean isMultidriver() {
		return multidriver;
	}

	public void setMultidriver(Boolean multidriver) {
		this.multidriver = multidriver;
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

    public Series getSeries() {
        return series;
    }

    public List<Driver> getDriversChampions() {
		return driversChampions;
	}

    public SeriesEdition driversChampions(List<Driver> driversChampions) {
    	this.driversChampions = driversChampions;
    	return this;
    }
    
	public void setDriversChampions(List<Driver> driversChampions) {
		this.driversChampions = driversChampions;
	}

	public List<Team> getTeamsChampions() {
		return teamsChampions;
	}
	
	public SeriesEdition teamsChampions(List<Team> teamsChampions) {
		this.teamsChampions = teamsChampions;
		return this;
	}

	public void setTeamsChampions(List<Team> teamsChampions) {
		this.teamsChampions = teamsChampions;
	}

	public SeriesEdition series(Series series) {
        this.series = series;
        return this;
    }

    public void setSeries(Series series) {
        this.series = series;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    public Boolean getDriversStandings() {
		return driversStandings;
	}

	public void setDriversStandings(Boolean driversStandings) {
		this.driversStandings = driversStandings;
	}

	public Boolean getTeamsStandings() {
		return teamsStandings;
	}

	public void setTeamsStandings(Boolean teamsStandings) {
		this.teamsStandings = teamsStandings;
	}

	public Boolean getManufacturersStandings() {
		return manufacturersStandings;
	}

	public void setManufacturersStandings(Boolean manufacturersStandings) {
		this.manufacturersStandings = manufacturersStandings;
	}

	public Integer getNumEvents() {
		return numEvents;
	}
	
	public SeriesEdition numEvents(Integer numEvents) {
		this.numEvents = numEvents;
		return this;
	}

	public void setNumEvents(Integer numEvents) {
		this.numEvents = numEvents;
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
            ", name='" + getEditionName() + "'" +
            ", period='" + getPeriod() + "'" +
            ", singleChassis='" + isSingleChassis() + "'" +
            ", singleEngine='" + isSingleEngine() + "'" +
            ", singleTyre='" + isSingleTyre() + "'" +
            "}";
    }
}

package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.time.LocalDate;
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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.IndexedEmbedded;
import org.hibernate.search.annotations.Store;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A EventEdition.
 */
@Entity
@Table(name = "event_edition")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Indexed
public class EventEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "edition_year", nullable = false)
    @Field(store = Store.NO)
    private Integer editionYear;

    @NotNull
    @Size(max = 40)
    @Column(name = "short_event_name", length = 40, nullable = false)
    @Field(store = Store.NO)
    private String shortEventName;

    @NotNull
    @Size(max = 100)
    @Column(name = "long_event_name", length = 100, nullable = false)
    @Field(store = Store.NO)
    private String longEventName;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;
    
    @Column(name = "multidriver")
    private Boolean multidriver = false;
    
    @Transient
    private Long previousEditionId;
    
    @Transient
    private Long nextEditionId;

    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="CATEGORIES_EVENT",
        joinColumns=@JoinColumn(name="event_edition_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="category_id", referencedColumnName="ID"))
    private List<Category> allowedCategories;

    @ManyToOne
    @IndexedEmbedded
    private RacetrackLayout trackLayout;

    @ManyToOne
    private Event event;
    
    @Column(name = "single_chassis")
    private Boolean singleChassis;

    @Column(name = "single_engine")
    private Boolean singleEngine;

    @Column(name = "single_tyre")
    private Boolean singleTyre;
    
    @Column(name = "single_fuel")
    private Boolean singleFuel;
    
    @OneToOne
    @JoinColumn(name="series_edition_id")
    @JsonIgnore
    private SeriesEdition seriesEdition;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getEditionYear() {
        return editionYear;
    }

    public EventEdition editionYear(Integer editionYear) {
        this.editionYear = editionYear;
        return this;
    }

    public void setEditionYear(Integer editionYear) {
        this.editionYear = editionYear;
    }

    public String getShortEventName() {
        return shortEventName;
    }

    public EventEdition shortEventName(String shortEventName) {
        this.shortEventName = shortEventName;
        return this;
    }

    public void setShortEventName(String shortEventName) {
        this.shortEventName = shortEventName;
    }

    public String getLongEventName() {
        return longEventName;
    }

    public EventEdition longEventName(String longEventName) {
        this.longEventName = longEventName;
        return this;
    }

    public void setLongEventName(String longEventName) {
        this.longEventName = longEventName;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public EventEdition eventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
        return this;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public List<Category> getAllowedCategories() {
        return allowedCategories;
    }

    public EventEdition allowedCategories(List<Category> categories) {
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

    public RacetrackLayout getTrackLayout() {
        return trackLayout;
    }

    public EventEdition trackLayout(RacetrackLayout racetrackLayout) {
        this.trackLayout = racetrackLayout;
        return this;
    }

    public void setTrackLayout(RacetrackLayout racetrackLayout) {
        this.trackLayout = racetrackLayout;
    }

    public Event getEvent() {
        return event;
    }

    public EventEdition event(Event event) {
        this.event = event;
        return this;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
    
	public Boolean getSingleChassis() {
		return singleChassis;
	}
	
	public EventEdition singleChassis(Boolean singleChassis) {
		this.singleChassis = singleChassis;
		return this;
	}

	public void setSingleChassis(Boolean singleChassis) {
		this.singleChassis = singleChassis;
	}

	public Boolean getSingleEngine() {
		return singleEngine;
	}

	public EventEdition singleEngine(Boolean singleEngine) {
		this.singleEngine = singleEngine;
		return this;
	}
	
	public void setSingleEngine(Boolean singleEngine) {
		this.singleEngine = singleEngine;
	}

	public Boolean getSingleTyre() {
		return singleTyre;
	}

	public EventEdition singleTyre(Boolean singleTyre) {
		this.singleTyre = singleTyre;
		return this;
	}
	
	public void setSingleTyre(Boolean singleTyre) {
		this.singleTyre = singleTyre;
	}
	
	public Boolean getSingleFuel() {
		return singleFuel;
	}

	public EventEdition singleFuel(Boolean singleFuel) {
		this.singleFuel = singleFuel;
		return this;
	}
	
	public void setSingleFuel(Boolean singleFuel) {
		this.singleFuel = singleFuel;
	}

    public Boolean isMultidriver() {
    	if (multidriver == null) {
    		multidriver = false;
    	}
		return multidriver;
	}

    public EventEdition multidriver(Boolean multidriver) {
		this.multidriver = multidriver;
		return this;
	}
    
	public void setMultidriver(Boolean multidriver) {
		this.multidriver = multidriver;
	}

	public Long getPreviousEditionId() {
		return previousEditionId;
	}
	
	public EventEdition previousEditionId(Long previousEditionId) {
		this.previousEditionId = previousEditionId;
		return this;
	}

	public void setPreviousEditionId(Long previousEditionId) {
		this.previousEditionId = previousEditionId;
	}

	public Long getNextEditionId() {
		return nextEditionId;
	}
	
	public EventEdition nextEditionId(Long nextEditionId) {
		this.nextEditionId = nextEditionId;
		return this;
	}

	public void setNextEditionId(Long nextEditionId) {
		this.nextEditionId = nextEditionId;
	}

	public SeriesEdition getSeriesEdition() {
		return seriesEdition;
	}

	public void setSeriesEdition(SeriesEdition seriesEdition) {
		this.seriesEdition = seriesEdition;
	}
	
	@JsonProperty("seriesId")
	public Long getSeriesId() {
		if (seriesEdition != null) {
			return seriesEdition.getId();
		}
		return null;
	}
	
	@JsonProperty("seriesName")
	public String getSeriesName() {
		if (seriesEdition != null) {
			return seriesEdition.getEditionName();
		}
		return null;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEdition eventEdition = (EventEdition) o;
        if (eventEdition.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eventEdition.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventEdition{" +
            "id=" + getId() +
            ", editionYear='" + getEditionYear() + "'" +
            ", shortEventName='" + getShortEventName() + "'" +
            ", longEventName='" + getLongEventName() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            "}";
    }
}

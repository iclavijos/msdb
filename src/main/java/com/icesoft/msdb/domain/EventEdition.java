package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A EventEdition.
 */
@Entity
@Table(name = "event_edition")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "eventedition")
@NamedEntityGraph(name="EventEditionWithoutRelations", attributeNodes= {
		@NamedAttributeNode(value="id"),
		@NamedAttributeNode(value="editionYear"),
		@NamedAttributeNode(value="shortEventName"),
		@NamedAttributeNode(value="longEventName")
})
public class EventEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "edition_year", nullable = false)
    private Integer editionYear;

    @NotNull
    @Size(max = 40)
    @Column(name = "short_event_name", length = 40, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String shortEventName;

    @NotNull
    @Size(max = 100)
    @Column(name = "long_event_name", length = 100, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties("eventEditions")
    private RacetrackLayout trackLayout;

    @Transient
    private byte[] poster;

    @Column(name = "poster_url")
    private String posterUrl;

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

    @ManyToMany(mappedBy = "events", fetch=FetchType.EAGER)
    private List<SeriesEdition> seriesEditions;

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

    public byte[] getPoster() {
        return poster;
    }

    public EventEdition poster(byte[] poster) {
        this.poster = poster;
        return this;
    }

    public void setPoster(byte[] poster) {
        this.poster = poster;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public EventEdition posterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
        return this;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
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

	public List<SeriesEdition> getSeriesEditions() {
		return seriesEditions;
	}

	public void setSeriesEditions(List<SeriesEdition> seriesEditions) {
		this.seriesEditions = seriesEditions;
	}

//	public void setSeriesEdition(SeriesEdition seriesEdition) {
//		if (this.seriesEditions == null) {
//			this.seriesEditions = new ArrayList<>();
//		}
//		this.seriesEditions.add(seriesEdition);
//	}

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

	@JsonProperty("seriesId")
	public List<Long> getSeriesId() {
		if (seriesEditions != null) {
			return seriesEditions.stream().map(s -> s.getId()).collect(Collectors.toList());
		}
		return null;
	}

	@JsonProperty("seriesName")
	public List<String> getSeriesName() {
		if (seriesEditions != null) {
			return seriesEditions.stream().map(s -> s.getEditionName()).collect(Collectors.toList());
		}
		return null;
	}

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventEdition)) {
            return false;
        }
        return id != null && id.equals(((EventEdition) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventEdition{" +
            "id=" + getId() +
            ", editionYear=" + getEditionYear() +
            ", shortEventName='" + getShortEventName() + "'" +
            ", longEventName='" + getLongEventName() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            "}";
    }
}

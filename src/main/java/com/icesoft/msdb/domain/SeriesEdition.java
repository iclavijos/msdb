package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.icesoft.msdb.MSDBException;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * A SeriesEdition.
 */
@Entity
@Table(name = "series_edition")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "seriesedition")
@Data @EqualsAndHashCode(callSuper = false)
@Builder @AllArgsConstructor @NoArgsConstructor
public class SeriesEdition extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 150)
    @Column(name = "edition_name", length = 150, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String editionName;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

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
    @Builder.Default
    private Boolean multidriver = false;

    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="CATEGORIES_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="category_id", referencedColumnName="id"))
    // @OrderBy("relevance")
    @Builder.Default
    private SortedSet<Category> allowedCategories = new TreeSet<>();

    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="POINTS_SERIES",
        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="points_id", referencedColumnName="id"))
    @Builder.Default
    private List<PointsSystem> pointsSystems = new ArrayList<>();

    @ManyToMany(fetch=FetchType.LAZY)
    @Fetch(FetchMode.JOIN)
    @JsonIgnore
    @org.springframework.data.annotation.Transient
    @JoinTable(
        name="EVENTS_SERIES",
        joinColumns=@JoinColumn(name="series_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="event_id", referencedColumnName="id"))
    @OrderBy("eventDate ASC")
    @Builder.Default
    private Set<EventEdition> events = new HashSet<>();

//    @ManyToMany(fetch=FetchType.EAGER)
//    @Fetch(FetchMode.SELECT)
//    @JoinTable(
//        name="SERIES_DRIVERS_CHAMPIONS",
//        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
//        inverseJoinColumns=@JoinColumn(name="driver_id", referencedColumnName="ID"))
//    private List<Driver> driversChampions;

//    @ManyToMany(fetch=FetchType.EAGER)
//    @Fetch(FetchMode.SELECT)
//    @JoinTable(
//        name="SERIES_TEAMS_CHAMPIONS",
//        joinColumns=@JoinColumn(name="series_edition_id", referencedColumnName="ID"),
//        inverseJoinColumns=@JoinColumn(name="team_id", referencedColumnName="ID"))
//    private List<Team> teamsChampions;

    @ManyToOne
    @org.springframework.data.annotation.Transient
    private Series series;

    @Column(name="drivers_standings")
    @Builder.Default
    private Boolean driversStandings = Boolean.TRUE;

    @Column(name="teams_standings")
    @Builder.Default
    private Boolean teamsStandings = Boolean.FALSE;

    @Column(name="manufacturers_standings")
    @Builder.Default
    private Boolean manufacturersStandings = Boolean.FALSE;

    @Column(name="num_events", nullable=false)
    private Integer numEvents;

    @Column(name="standings_per_category")
    @Builder.Default
    private Boolean standingsPerCategory = Boolean.FALSE;

    @Column(name="calendar_id")
    private String calendarId;

    public SeriesEdition(SeriesEdition source, String period) {
        this.setId(null);
        this.setPeriod(period);
        this.setEditionName(period + " " + source.getSeries().getName());
        this.setEvents(null);
        this.setSeries(source.getSeries());
        this.setSingleTyre(source.getSingleTyre());
        this.setSingleEngine(source.getSingleEngine());
        this.setSingleChassis(source.getSingleChassis());
        this.setStandingsPerCategory(source.getStandingsPerCategory());
        this.setNumEvents(source.getNumEvents());
        this.setMultidriver(source.getMultidriver());
        this.setTeamsStandings(source.getTeamsStandings());
        this.setManufacturersStandings(source.getManufacturersStandings());
        this.setDriversStandings(source.getDriversStandings());
        this.setLogoUrl(source.getLogoUrl());
        this.setAllowedCategories(new TreeSet<>());
        this.getAllowedCategories().addAll(source.getAllowedCategories());
        this.setPointsSystems(new ArrayList<>());
        this.getPointsSystems().addAll(source.getPointsSystems());
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

    public String getLogoUrl() {
        if (null != logoUrl) {
            return logoUrl;
        } else {
            if (null != series) {
                return series.getLogoUrl();
            } else {
                return null;
            }
        }
    }

	public void addEvent(EventEdition event) {
        Set<EventEdition> events = Optional.ofNullable(getEvents()).orElse(new HashSet<>());
        events.add(event);
        this.events = events;
//        event.getSeriesEditions().add(this);
    }

    public void removeEvent(EventEdition event) {
        this.events.remove(event);
        event.getSeriesEditions().remove(this);
    }

//    public List<Driver> getDriversChampions() {
//		return driversChampions;
//	}
//
//    public SeriesEdition driversChampions(List<Driver> driversChampions) {
//    	this.driversChampions = driversChampions;
//    	return this;
//    }
//
//	public void setDriversChampions(List<Driver> driversChampions) {
//		this.driversChampions = driversChampions;
//	}

    @Override
    @JsonIgnore
    public SeriesEdition trim() {
        return SeriesEdition.builder()
            .id(this.id)
            .editionName(this.editionName)
            .build();
    }
}

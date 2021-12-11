package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.repository.converter.EventStatusTypeConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

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
@Data @EqualsAndHashCode(callSuper=false)
@NoArgsConstructor
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

    @Convert(converter = EventStatusTypeConverter.class)
    private EventStatusType status;

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
    @OrderBy("relevance")
    private SortedSet<Category> allowedCategories;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties("eventEditions")
    private RacetrackLayout trackLayout;

    @Transient
    private byte[] poster;

    @Column(name = "poster_url")
    private String posterUrl;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Event event;

    @Column(name = "single_chassis")
    private Boolean singleChassis;

    @Column(name = "single_engine")
    private Boolean singleEngine;

    @Column(name = "single_tyre")
    private Boolean singleTyre;

    @Column(name = "single_fuel")
    private Boolean singleFuel;

    @Column(name = "location")
    private String location;

    @Column(name = "location_time_zone")
    private String locationTimeZone;

    @ManyToMany(mappedBy = "events", fetch=FetchType.EAGER)
    private Set<SeriesEdition> seriesEditions;

    public EventEdition(EventEdition copyFrom) {
        this.shortEventName = copyFrom.shortEventName;
        this.longEventName = copyFrom.longEventName;
        this.eventDate = copyFrom.eventDate;
        this.multidriver = copyFrom.multidriver;
        this.status = copyFrom.status;
        this.setAllowedCategories(new TreeSet<>());
        copyFrom.getAllowedCategories()
            .forEach(category -> this.allowedCategories.add(category));
        this.trackLayout = copyFrom.trackLayout;
        this.posterUrl = copyFrom.posterUrl;
        this.event = copyFrom.event;
        this.singleChassis = copyFrom.singleChassis;
        this.singleEngine = copyFrom.singleEngine;
        this.singleTyre = copyFrom.singleTyre;
        this.singleFuel = copyFrom.singleFuel;
        this.location = copyFrom.location;
        this.locationTimeZone = copyFrom.locationTimeZone;
        this.seriesEditions = copyFrom.seriesEditions;
    }

    public void addAllowedCategory(Category category) {
        if (Optional.ofNullable(allowedCategories).isEmpty()) {
            allowedCategories = new TreeSet<>();
        }
        allowedCategories.add(category);
    }

    public EventEdition allowedCategories(SortedSet<Category> categories) {
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

    public void setAllowedCategories(SortedSet<Category> categories) {
    	if (allowedCategories == null) {
    		this.allowedCategories = categories;
    		return;
    	}
        this.allowedCategories.clear();
        if (categories != null) {
        	this.allowedCategories.addAll(categories);
        }
    }

    public Boolean isMultidriver() {
        return multidriver;
    }

}

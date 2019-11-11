package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A EventEdition.
 */
@Entity
@Table(name = "event_edition")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "eventedition")
public class EventEdition implements Serializable {

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
    private String shortEventName;

    @NotNull
    @Size(max = 100)
    @Column(name = "long_event_name", length = 100, nullable = false)
    private String longEventName;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("eventEditions")
    private Category allowedCategories;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("eventEditions")
    private RacetrackLayout trackLayout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("eventEditions")
    private Event event;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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

    public Category getAllowedCategories() {
        return allowedCategories;
    }

    public EventEdition allowedCategories(Category category) {
        this.allowedCategories = category;
        return this;
    }

    public void setAllowedCategories(Category category) {
        this.allowedCategories = category;
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

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
        return 31;
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

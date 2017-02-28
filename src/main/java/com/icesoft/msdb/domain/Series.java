package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Series.
 */
@Entity
@Table(name = "series")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "series")
public class Series implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    private String shortname;

    @Size(max = 50)
    @Column(name = "organizer", length = 50)
    private String organizer;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @OneToMany(mappedBy = "series")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SeriesEdition> editions = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Series name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortname() {
        return shortname;
    }

    public Series shortname(String shortname) {
        this.shortname = shortname;
        return this;
    }

    public void setShortname(String shortname) {
        this.shortname = shortname;
    }

    public String getOrganizer() {
        return organizer;
    }

    public Series organizer(String organizer) {
        this.organizer = organizer;
        return this;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public byte[] getLogo() {
        return logo;
    }

    public Series logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public Series logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Set<SeriesEdition> getEditions() {
        return editions;
    }

    public Series editions(Set<SeriesEdition> seriesEditions) {
        this.editions = seriesEditions;
        return this;
    }

    public Series addEditions(SeriesEdition seriesEdition) {
        this.editions.add(seriesEdition);
        seriesEdition.setSeries(this);
        return this;
    }

    public Series removeEditions(SeriesEdition seriesEdition) {
        this.editions.remove(seriesEdition);
        seriesEdition.setSeries(null);
        return this;
    }

    public void setEditions(Set<SeriesEdition> seriesEditions) {
        this.editions = seriesEditions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Series series = (Series) o;
        if (series.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, series.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Series{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", shortname='" + shortname + "'" +
            ", organizer='" + organizer + "'" +
            ", logo='" + logo + "'" +
            ", logoContentType='" + logoContentType + "'" +
            '}';
    }
}

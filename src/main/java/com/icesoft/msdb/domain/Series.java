package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Series.
 */
@Entity
@Table(name = "series")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "series")
public class Series extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String shortname;

    @Size(max = 50)
    @Column(name = "organizer", length = 50)
    private String organizer;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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

    public String getLogoUrl() {
        return logoUrl;
    }

    public Series logoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
        return this;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Series)) {
            return false;
        }
        return id != null && id.equals(((Series) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Series{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", shortname='" + getShortname() + "'" +
            ", organizer='" + getOrganizer() + "'" +
            ", logoUrl='" + getLogoUrl() + "'" +
            '}';
    }
}

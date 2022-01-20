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
 * A Team.
 */
@Entity
@Table(name = "team")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "team")
public class Team extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String description;

    @Size(max = 100)
    @Column(name = "hq_location", length = 100)
    private String hqLocation;

    @Transient
    private byte[] logo;

    @Column
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

    public Team name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Team description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHqLocation() {
        return hqLocation;
    }

    public Team hqLocation(String hqLocation) {
        this.hqLocation = hqLocation;
        return this;
    }

    public void setHqLocation(String hqLocation) {
        this.hqLocation = hqLocation;
    }

    public byte[] getLogo() {
        return logo;
    }

    public Team logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoUrl() {
    	return logoUrl;
    }

    public Team logoUrl(String logoUrl) {
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
        if (!(o instanceof Team)) {
            return false;
        }
        return id != null && id.equals(((Team) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Team{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", hqLocation='" + getHqLocation() + "'" +
            ", logoUrl='" + getLogoUrl() + "'" +
            '}';
    }
}

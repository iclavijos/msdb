package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A FuelProvider.
 */
@Entity
@Table(name = "fuel_provider")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "fuelprovider")
@Data @EqualsAndHashCode(callSuper=false)
public class FuelProvider extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String name;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public FuelProvider name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public FuelProvider logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public FuelProvider logoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
        return this;
    }

}

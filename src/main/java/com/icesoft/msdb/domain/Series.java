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
@Data @EqualsAndHashCode(callSuper = false)
public class Series extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String shortname;

    @Size(max = 50)
    @Column(name = "organizer", length = 50)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String organizer;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column
    private Integer relevance;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

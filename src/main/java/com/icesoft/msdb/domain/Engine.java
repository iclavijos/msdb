package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
 * A Engine.
 */
@Entity
@Table(name = "engine")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "engine")
@NamedEntityGraph(name="EngineWithoutRelations", attributeNodes= {
		@NamedAttributeNode(value="id"),
		@NamedAttributeNode(value="name"),
		@NamedAttributeNode(value="manufacturer"),
		@NamedAttributeNode(value="capacity"),
		@NamedAttributeNode(value="architecture"),
		@NamedAttributeNode(value="debutYear"),
		@NamedAttributeNode(value="petrolEngine"),
		@NamedAttributeNode(value="dieselEngine"),
		@NamedAttributeNode(value="electricEngine"),
		@NamedAttributeNode(value="otherEngine"),
		@NamedAttributeNode(value="turbo")
})
@Data @EqualsAndHashCode(callSuper = false)
public class Engine extends AbstractAuditingEntity implements Serializable {

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

    @NotNull
    @Size(max = 50)
    @Column(name = "manufacturer", length = 50, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String manufacturer;

    @Column(name = "capacity")
    private Integer capacity;

    @Size(max = 10)
    @Column(name = "architecture", length = 10)
    private String architecture;

    @NotNull
    @Column(name = "debut_year", nullable = false)
    private Integer debutYear;

    @Column(name = "petrol_engine")
    private Boolean petrolEngine;

    @Column(name = "diesel_engine")
    private Boolean dieselEngine;

    @Column(name = "electric_engine")
    private Boolean electricEngine;

    @Column(name = "other_engine")
    private Boolean otherEngine;

    @Column(name = "turbo")
    private Boolean turbo;

    @Size(max = 1024)
    @Column(name = "comments", length = 1024)
    private String comments;

    @Transient
    private byte[] image;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "derivedFrom")
    @JsonIgnore
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Engine> evolutions = new HashSet<>();

    @ManyToOne
    private Engine derivedFrom;

    @Column
    private Boolean rebranded;
}

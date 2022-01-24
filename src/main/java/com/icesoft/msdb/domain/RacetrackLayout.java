package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;

/**
 * A RacetrackLayout.
 */
@Entity
@Table(name = "racetrack_layout")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "racetracklayout")
@Data @EqualsAndHashCode(callSuper = false)
public class RacetrackLayout extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String name;

    @NotNull
    @Column(name = "length", nullable = false)
    private Integer length;

    @NotNull
    private Integer yearFirstUse;

    @Transient
    private byte[] layoutImage;

    @Column
    private String layoutImageUrl;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    @EqualsAndHashCode.Exclude @ToString.Exclude
    private Racetrack racetrack;

}

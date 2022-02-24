package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Racetrack.
 */
@Entity
@Table(name = "racetrack")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "racetrack")
@Data @EqualsAndHashCode(callSuper = false)
public class Racetrack extends AbstractAuditingEntity implements Serializable {

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
    @Size(max = 100)
    @Column(name = "location", length = 100, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String location;

    @NotNull
    @ManyToOne
    @JoinColumn(name="country_code")
    @Field(type = FieldType.Object)
    private Country country;

    @Column(name= "time_zone")
    private String timeZone;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @OneToMany(mappedBy = "racetrack")
    @JsonIgnore
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @EqualsAndHashCode.Exclude @ToString.Exclude
    @org.springframework.data.annotation.Transient
    private Set<RacetrackLayout> layouts = new HashSet<>();

}

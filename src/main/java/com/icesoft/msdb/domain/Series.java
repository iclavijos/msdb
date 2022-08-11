package com.icesoft.msdb.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A Series.
 */
@Entity
@Table(name = "series")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "series")
@Data @EqualsAndHashCode(callSuper = false)
@Builder @AllArgsConstructor @NoArgsConstructor
public class Series extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String shortname;

    @Size(max = 50)
    @Column(name = "organizer", length = 50)
    @Field(type = FieldType.Search_As_You_Type)
    private String organizer;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column
    private Integer relevance;

    @Override
    @JsonIgnore
    public Series trim() {
        return Series.builder()
            .id(this.id)
            .name(this.name)
            .shortname(this.shortname)
            .organizer(this.organizer)
            .build();
    }
}

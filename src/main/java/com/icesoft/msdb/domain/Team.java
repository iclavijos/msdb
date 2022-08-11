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
 * A Team.
 */
@Entity
@Table(name = "team")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "team")
@Data @EqualsAndHashCode(callSuper = false)
@Builder @AllArgsConstructor @NoArgsConstructor
public class Team extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    @Field(type = FieldType.Search_As_You_Type)
    private String description;

    @Size(max = 100)
    @Column(name = "hq_location", length = 100)
    private String hqLocation;

    @Transient
    private byte[] logo;

    @Column
    private String logoUrl;

    @Override
    @JsonIgnore
    public Team trim() {
        return Team.builder()
            .id(this.id)
            .name(this.name)
            .description(this.description)
            .build();
    }
}

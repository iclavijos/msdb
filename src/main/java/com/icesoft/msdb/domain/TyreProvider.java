package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;

/**
 * A TyreProvider.
 */
@Entity
@Table(name = "tyre_provider")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tyreprovider")
@Data @EqualsAndHashCode(callSuper = false)
@Builder @AllArgsConstructor @NoArgsConstructor
public class TyreProvider extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String name;

    @Transient
    private byte[] logo;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name="letter_color")
    private String letterColor;

    @Column(name="background_color")
    private String backgroundColor;

    @Override
    @JsonIgnore
    public TyreProvider trim() {
        return TyreProvider.builder()
            .id(this.id)
            .name(this.name)
            .build();
    }
}

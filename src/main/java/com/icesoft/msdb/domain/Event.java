package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "event")
@NamedEntityGraph(name="EventWithoutRelations", attributeNodes= {
		@NamedAttributeNode(value="id"),
		@NamedAttributeNode(value="name"),
		@NamedAttributeNode(value="description")
})
@Data @EqualsAndHashCode(callSuper=false)
public class Event extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    private String description;

    @OneToMany(mappedBy = "event")
    @JsonIgnore
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<EventEdition> editions = new HashSet<>();

    @Column(name= "rally")
    private Boolean rally;

    @Column(name= "raid")
    private Boolean raid;

    public boolean isRally() {
        return Optional.ofNullable(rally).orElse(Boolean.FALSE).booleanValue();
    }

    public boolean isRaid() {
        return Optional.ofNullable(raid).orElse(Boolean.FALSE).booleanValue();
    }
}

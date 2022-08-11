package com.icesoft.msdb.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.util.Assert;

import java.io.Serializable;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "category")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Category extends AbstractAuditingEntity implements Serializable, Comparable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    @EqualsAndHashCode.Include
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    @EqualsAndHashCode.Include
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    @EqualsAndHashCode.Include
    private String shortname;

    @Column
    private Integer relevance;

    @Column(name="category_color")
    private String categoryColor;

    @Column(name="category_front_color")
    private String categoryFrontColor;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public Category name(String name) {
        this.name = name;
        return this;
    }

    public Category shortname(String shortname) {
        this.shortname = shortname;
        return this;
    }

    @Override
    public int compareTo(Object other) {
        Assert.notNull(other, "Category to compare to cannot be null");
        Category otherCategory = (Category)other;
        if (relevance != null) {
            int result =  this.getRelevance().compareTo(otherCategory.getRelevance());
            if (result == 0) {
                return this.getId().compareTo(otherCategory.getId());
            } else {
                return result;
            }
        } else {
            return this.getId().compareTo(otherCategory.getId());
        }
    }

    @Override
    @JsonIgnore
    public Category trim() {
        return Category.builder()
            .id(this.id)
            .name(this.name)
            .shortname(this.shortname)
            .build();
    }
}

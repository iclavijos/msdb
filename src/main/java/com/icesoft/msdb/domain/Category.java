package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import lombok.EqualsAndHashCode;
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
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    @EqualsAndHashCode.Include
    private String name;

    @NotNull
    @Size(max = 10)
    @Column(name = "shortname", length = 10, nullable = false)
    @Field(type = FieldType.Text, fielddata = true, normalizer = "lowercase_keyword")
    @EqualsAndHashCode.Include
    private String shortname;

    @Column
    private Integer relevance;

    @Column(name="category_color")
    private String categoryColor;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Category name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortname() {
        return shortname;
    }

    public Category shortname(String shortname) {
        this.shortname = shortname;
        return this;
    }

    public void setShortname(String shortname) {
        this.shortname = shortname;
    }

    public Integer getRelevance() {
        return relevance;
    }

    public void setRelevance(Integer relevance) {
        this.relevance = relevance;
    }

    public String getCategoryColor() {
        return categoryColor;
    }

    public void setCategoryColor(String categoryColor) {
        this.categoryColor = categoryColor;
    }

    @Override
    public String toString() {
        return "Category{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", shortname='" + shortname + "'" +
            ", categoryColor='" + categoryColor + "'" +
            '}';
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
}

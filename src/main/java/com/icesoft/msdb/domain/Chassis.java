package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Chassis.
 */
@Entity
@Table(name = "chassis")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "chassis")
public class Chassis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(max = 50)
    @Column(name = "manufacturer", length = 50, nullable = false)
    private String manufacturer;

    @NotNull
    @Column(name = "debut_year", nullable = false)
    private Integer debutYear;

    @OneToMany(mappedBy = "derivedFrom")
    private Set<Chassis> evolutions = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("chassis")
    private Chassis derivedFrom;

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

    public Chassis name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public Chassis manufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
        return this;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Integer getDebutYear() {
        return debutYear;
    }

    public Chassis debutYear(Integer debutYear) {
        this.debutYear = debutYear;
        return this;
    }

    public void setDebutYear(Integer debutYear) {
        this.debutYear = debutYear;
    }

    public Set<Chassis> getEvolutions() {
        return evolutions;
    }

    public Chassis evolutions(Set<Chassis> chassis) {
        this.evolutions = chassis;
        return this;
    }

    public Chassis addEvolutions(Chassis chassis) {
        this.evolutions.add(chassis);
        chassis.setDerivedFrom(this);
        return this;
    }

    public Chassis removeEvolutions(Chassis chassis) {
        this.evolutions.remove(chassis);
        chassis.setDerivedFrom(null);
        return this;
    }

    public void setEvolutions(Set<Chassis> chassis) {
        this.evolutions = chassis;
    }

    public Chassis getDerivedFrom() {
        return derivedFrom;
    }

    public Chassis derivedFrom(Chassis chassis) {
        this.derivedFrom = chassis;
        return this;
    }

    public void setDerivedFrom(Chassis chassis) {
        this.derivedFrom = chassis;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chassis)) {
            return false;
        }
        return id != null && id.equals(((Chassis) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Chassis{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", manufacturer='" + getManufacturer() + "'" +
            ", debutYear=" + getDebutYear() +
            "}";
    }
}

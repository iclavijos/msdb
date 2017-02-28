package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Chassis.
 */
@Entity
@Table(name = "chassis")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "chassis")
public class Chassis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Chassis> evolutions = new HashSet<>();

    @ManyToOne
    private Chassis derivedFrom;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Chassis chassis = (Chassis) o;
        if (chassis.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, chassis.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Chassis{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", manufacturer='" + manufacturer + "'" +
            ", debutYear='" + debutYear + "'" +
            '}';
    }
}

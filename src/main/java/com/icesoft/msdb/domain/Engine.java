package com.icesoft.msdb.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Engine.
 */
@Entity
@Table(name = "engine")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "engine")
public class Engine implements Serializable {

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
    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @NotNull
    @Size(max = 10)
    @Column(name = "architecture", length = 10, nullable = false)
    private String architecture;

    @NotNull
    @Column(name = "debut_year", nullable = false)
    private Integer debutYear;

    @Column(name = "petrol_engine")
    private Boolean petrolEngine;

    @Column(name = "diesel_engine")
    private Boolean dieselEngine;

    @Column(name = "electric_engine")
    private Boolean electricEngine;

    @Column(name = "turbo")
    private Boolean turbo;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @OneToMany(mappedBy = "derivedFrom")
    private Set<Engine> evolutions = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("engines")
    private Engine derivedFrom;

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

    public Engine name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public Engine manufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
        return this;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Engine capacity(Integer capacity) {
        this.capacity = capacity;
        return this;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getArchitecture() {
        return architecture;
    }

    public Engine architecture(String architecture) {
        this.architecture = architecture;
        return this;
    }

    public void setArchitecture(String architecture) {
        this.architecture = architecture;
    }

    public Integer getDebutYear() {
        return debutYear;
    }

    public Engine debutYear(Integer debutYear) {
        this.debutYear = debutYear;
        return this;
    }

    public void setDebutYear(Integer debutYear) {
        this.debutYear = debutYear;
    }

    public Boolean isPetrolEngine() {
        return petrolEngine;
    }

    public Engine petrolEngine(Boolean petrolEngine) {
        this.petrolEngine = petrolEngine;
        return this;
    }

    public void setPetrolEngine(Boolean petrolEngine) {
        this.petrolEngine = petrolEngine;
    }

    public Boolean isDieselEngine() {
        return dieselEngine;
    }

    public Engine dieselEngine(Boolean dieselEngine) {
        this.dieselEngine = dieselEngine;
        return this;
    }

    public void setDieselEngine(Boolean dieselEngine) {
        this.dieselEngine = dieselEngine;
    }

    public Boolean isElectricEngine() {
        return electricEngine;
    }

    public Engine electricEngine(Boolean electricEngine) {
        this.electricEngine = electricEngine;
        return this;
    }

    public void setElectricEngine(Boolean electricEngine) {
        this.electricEngine = electricEngine;
    }

    public Boolean isTurbo() {
        return turbo;
    }

    public Engine turbo(Boolean turbo) {
        this.turbo = turbo;
        return this;
    }

    public void setTurbo(Boolean turbo) {
        this.turbo = turbo;
    }

    public byte[] getImage() {
        return image;
    }

    public Engine image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public Engine imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Engine> getEvolutions() {
        return evolutions;
    }

    public Engine evolutions(Set<Engine> engines) {
        this.evolutions = engines;
        return this;
    }

    public Engine addEvolutions(Engine engine) {
        this.evolutions.add(engine);
        engine.setDerivedFrom(this);
        return this;
    }

    public Engine removeEvolutions(Engine engine) {
        this.evolutions.remove(engine);
        engine.setDerivedFrom(null);
        return this;
    }

    public void setEvolutions(Set<Engine> engines) {
        this.evolutions = engines;
    }

    public Engine getDerivedFrom() {
        return derivedFrom;
    }

    public Engine derivedFrom(Engine engine) {
        this.derivedFrom = engine;
        return this;
    }

    public void setDerivedFrom(Engine engine) {
        this.derivedFrom = engine;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Engine)) {
            return false;
        }
        return id != null && id.equals(((Engine) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Engine{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", manufacturer='" + getManufacturer() + "'" +
            ", capacity=" + getCapacity() +
            ", architecture='" + getArchitecture() + "'" +
            ", debutYear=" + getDebutYear() +
            ", petrolEngine='" + isPetrolEngine() + "'" +
            ", dieselEngine='" + isDieselEngine() + "'" +
            ", electricEngine='" + isElectricEngine() + "'" +
            ", turbo='" + isTurbo() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}

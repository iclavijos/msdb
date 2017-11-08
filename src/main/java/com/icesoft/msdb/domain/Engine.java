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
 * A Engine.
 */
@Entity
@Table(name = "engine")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "engine")
public class Engine extends AbstractAuditingEntity implements Serializable {

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

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

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
    
    @Column(name = "other_engine")
    private Boolean otherEngine;
    
    @Column(name = "turbo")
    private Boolean turbo;
    
    @Size(max = 1024)
    @Column(name = "comments", length = 1024)
    private String comments;

    @Transient
    private byte[] image;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "derivedFrom")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Engine> evolutions = new HashSet<>();

    @ManyToOne
    private Engine derivedFrom;
    
    @Column
    private Boolean rebranded;

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

    public Boolean getOtherEngine() {
		return otherEngine;
	}
    
    public Engine otherEngine(Boolean otherEngine) {
    	this.otherEngine = otherEngine;
    	return this;
    }

	public void setOtherEngine(Boolean otherEngine) {
		this.otherEngine = otherEngine;
	}

	public String getComments() {
		return comments;
	}
	
	public Engine comments(String comments) {
		this.comments = comments;
		return this;
	}

	public void setComments(String comments) {
		this.comments = comments;
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

    public String getImageUrl() {
    	return imageUrl;
    }
    
    public Engine imageUrl(String imageUrl) {
    	this.imageUrl = imageUrl;
    	return this;
    }
    
    public void setImageUrl(String imageUrl) {
    	this.imageUrl = imageUrl;
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
    
    public Boolean getRebranded() {
		return rebranded;
	}

    public Engine rebranded(Boolean rebranded) {
    	this.rebranded = rebranded;
    	return this;
    }
    
	public void setRebranded(Boolean rebranded) {
		this.rebranded = rebranded;
	}

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Engine engine = (Engine) o;
        if (engine.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), engine.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Engine{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", manufacturer='" + getManufacturer() + "'" +
            ", capacity='" + getCapacity() + "'" +
            ", architecture='" + getArchitecture() + "'" +
            ", debutYear='" + getDebutYear() + "'" +
            ", petrolEngine='" + isPetrolEngine() + "'" +
            ", dieselEngine='" + isDieselEngine() + "'" +
            ", electricEngine='" + isElectricEngine() + "'" +
            ", turbo='" + isTurbo() + "'" +
            ", comments='" + getComments() + "'" +
            "}";
    }
}

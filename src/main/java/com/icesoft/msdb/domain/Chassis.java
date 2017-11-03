package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.search.annotations.Field;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A Chassis.
 */
@Entity
@Table(name = "chassis")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Chassis extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    @Field
    private String name;

    @NotNull
    @Size(max = 50)
    @Column(name = "manufacturer", length = 50, nullable = false)
    @Field
    private String manufacturer;

    @NotNull
    @Column(name = "debut_year", nullable = false)
    private Integer debutYear;
    
    @Column
    private Boolean rebranded;
    
    @Transient
    private byte[] image;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "derivedFrom")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Chassis> evolutions = new HashSet<>();

    @ManyToOne
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
    
    public Boolean getRebranded() {
		return rebranded;
	}

    public Chassis rebranded(Boolean rebranded) {
    	this.rebranded = rebranded;
    	return this;
    }
    
	public void setRebranded(Boolean rebranded) {
		this.rebranded = rebranded;
	}

	public byte[] getImage() {
		return image;
	}
	
	public Chassis image(byte[] image) {
		this.image = image;
		return this;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public String getImageUrl() {
		return imageUrl;
	}
	
	public Chassis imageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
		return this;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
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
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Chassis chassis = (Chassis) o;
        if (chassis.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), chassis.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Chassis{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", manufacturer='" + getManufacturer() + "'" +
            ", debutYear='" + getDebutYear() + "'" +
            "}";
    }
}

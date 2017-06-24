package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Period;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Store;

/**
 * A Driver.
 */
@Entity
@Table(name = "driver")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Driver extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field
    private String name;

    @NotNull
    @Size(max = 60)
    @Column(name = "surname", length = 60, nullable = false)
    @Field
    private String surname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Size(max = 75)
    @Column(name = "birth_place", length = 75)
    private String birthPlace;
    
    @NotNull
    @Size(max = 2)
    @Column(name = "nationality", length = 2, nullable = false)
    @Field(store = Store.NO)
    private String nationality;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Size(max = 75)
    @Column(name = "death_place", length = 75)
    private String deathPlace;

    @Transient
    private byte[] portrait;
    
    @Column(name = "portrait_url")
    private String portraitUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Driver name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public Driver surname(String surname) {
        this.surname = surname;
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
    
    public String getFullName() {
    	return name + " " + surname;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public Driver birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public Driver birthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
        return this;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getNationality() {
		return nationality;
	}
    
    public Driver nationality(String nationality) {
    	this.nationality = nationality;
    	return this;
    }

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public LocalDate getDeathDate() {
        return deathDate;
    }

    public Driver deathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
        return this;
    }

    public void setDeathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
    }

    public String getDeathPlace() {
        return deathPlace;
    }

    public Driver deathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
        return this;
    }

    public void setDeathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
    }

    public byte[] getPortrait() {
        return portrait;
    }

    public Driver portrait(byte[] portrait) {
        this.portrait = portrait;
        return this;
    }

    public void setPortrait(byte[] portrait) {
        this.portrait = portrait;
    }
    
    public String getPortraitUrl() {
    	return portraitUrl;
    }
    
    public Driver portraitUrl(String portraitUrl) {
    	this.portraitUrl = portraitUrl;
    	return this;
    }
    
    public void setPortraitUrl(String portraitUrl) {
    	this.portraitUrl = portraitUrl;
    }
    
    public int getAge() {
    	if (birthDate == null) return 0;
    	
    	LocalDate end = (deathDate != null ? deathDate : LocalDate.now());
    	return Period.between(birthDate, end).getYears();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Driver driver = (Driver) o;
        if (driver.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, driver.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Driver{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", surname='" + surname + "'" +
            ", birthDate='" + birthDate + "'" +
            ", birthPlace='" + birthPlace + "'" +
            ", deathDate='" + deathDate + "'" +
            ", deathPlace='" + deathPlace + "'" +
            ", portrait='" + portrait + "'" +
            '}';
    }
}

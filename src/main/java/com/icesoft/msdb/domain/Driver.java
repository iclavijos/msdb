package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Driver.
 */
@Entity
@Table(name = "driver")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "driver")
@Setting(settingPath = "/elastic-settings/normalizer-setting.json")
public class Driver extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase_keyword")
    private String name;

    @NotNull
    @Size(max = 60)
    @Column(name = "surname", length = 60, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase_keyword")
    private String surname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Size(max = 75)
    @Column(name = "birth_place", length = 75)
    private String birthPlace;

    @ManyToOne
    @JoinColumn(name="nationality")
    @Field(type = FieldType.Object)
    private Country nationality;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Size(max = 75)
    @Column(name = "death_place", length = 75)
    private String deathPlace;

    @Transient
    private byte[] portrait;

    @Column(name = "portrait_url")
    private String portraitUrl;

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

    public Country getNationality() {
		return nationality;
	}

    public Driver nationality(Country nationality) {
    	this.nationality = nationality;
    	return this;
    }

	public void setNationality(Country nationality) {
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

    @JsonProperty
    public String getFaceUrl() {
    	String tmp = this.portraitUrl;
    	if (StringUtils.isEmpty(tmp)) return null;

    	return tmp.replace("upload/", "upload/w_70,h_70,c_thumb,g_face/");
    }

    @JsonProperty
    public int getAge() {
    	if (birthDate == null) return 0;

    	LocalDate end = (deathDate != null ? deathDate : LocalDate.now());
    	return Period.between(birthDate, end).getYears();
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Driver)) {
            return false;
        }
        return id != null && id.equals(((Driver) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Driver{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", surname='" + getSurname() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            ", birthPlace='" + getBirthPlace() + "'" +
            ", deathDate='" + getDeathDate() + "'" +
            ", deathPlace='" + getDeathPlace() + "'" +
            "}";
    }
}

package com.icesoft.msdb.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
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
@Data @EqualsAndHashCode(callSuper = false)
@Builder @AllArgsConstructor @NoArgsConstructor
public class Driver extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
    private String name;

    @NotNull
    @Size(max = 60)
    @Column(name = "surname", length = 60, nullable = false)
    @Field(type = FieldType.Search_As_You_Type)
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

    public String getFullName() {
    	return name + " " + surname;
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

    @Override
    @JsonIgnore
    public Driver trim() {
        return Driver.builder()
            .id(this.id)
            .name(this.name)
            .surname(this.surname)
            .birthPlace(this.birthPlace)
            .deathPlace(this.deathPlace)
            .build();
    }

}

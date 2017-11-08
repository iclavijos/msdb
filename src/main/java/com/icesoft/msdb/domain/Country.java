package com.icesoft.msdb.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

@Entity
@Table(name = "country")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "country")
public class Country implements Serializable {

	private static final long serialVersionUID = 3770783518977779168L;

	@Id
    @Column(name = "country_code", length= 2)
    private String countryCode;

    @NotNull
    @Size(max = 50)
    @Column(name = "country_name", length = 100, nullable = false)
    private String countryName;

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getCountryName() {
		return countryName;
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}
    
    @Transient
    public String getFlagImg() {
    	StringBuilder builder = new StringBuilder("/images/flags16/").append(countryCode).append(".png");
    	return builder.toString();
    }
	
}

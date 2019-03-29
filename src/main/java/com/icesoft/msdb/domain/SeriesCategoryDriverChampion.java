package com.icesoft.msdb.domain;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="series_drivers_champion")
public class SeriesCategoryDriverChampion {

	@JsonIgnore
	@ManyToOne
	private SeriesEdition seriesEdition;
	@ManyToOne
	private Category category;
	@ManyToOne
	private Driver driver;
	
	public SeriesEdition getSeriesEdition() {
		return seriesEdition;
	}
	public void setSeriesEdition(SeriesEdition seriesEdition) {
		this.seriesEdition = seriesEdition;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
	public Driver getDriver() {
		return driver;
	}
	public void setDriver(Driver driver) {
		this.driver = driver;
	}
	
}

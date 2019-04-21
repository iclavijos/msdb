package com.icesoft.msdb.domain;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="series_drivers_champion")
public class SeriesCategoryDriverChampion {

    @Id
    @GeneratedValue
    private Long id;
	@JsonIgnore
	@ManyToOne
	private SeriesEdition seriesEdition;
	@ManyToOne
	private Category category;
	@ManyToOne
	private Driver driver;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
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

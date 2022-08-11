package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "driver_event_points")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DriverEventPoints implements Serializable {

	private static final long serialVersionUID = 5979343790004806638L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@ManyToOne
	private Driver driver;

	@ManyToOne
	private EventSession session;

	@ManyToOne
	private SeriesEdition seriesEdition;

	@Column
	private Float points = 0f;

	@Column
	private String reason;

    @ManyToOne
    private Category category;

	public DriverEventPoints() {
		super();
	}

	public DriverEventPoints(Driver driver, EventSession session, SeriesEdition series, String reason) {
		this.driver = driver;
		this.session = session;
		this.seriesEdition = series;
		this.reason = reason;
	}

	public Long getId() {
		return id;
	}

	public Driver getDriver() {
		return driver;
	}

	public void setDriver(Driver driver) {
		this.driver = driver;
	}

	public EventSession getSession() {
		return session;
	}

	public void setSession(EventSession session) {
		this.session = session;
	}

	public SeriesEdition getSeriesEdition() {
		return seriesEdition;
	}

	public void setSeriesEdition(SeriesEdition seriesEdition) {
		this.seriesEdition = seriesEdition;
	}

	public Float getPoints() {
		return points;
	}

	public void setPoints(Float points) {
		this.points = points;
	}

	public void addPoints(Float points) {
		this.points += points;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DriverEventPoints driverPoints = (DriverEventPoints) o;
        if (driverPoints.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, driverPoints.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}

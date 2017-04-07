package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class EventEditionEntry extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "race_number", nullable = false)
    private Integer raceNumber;

    @NotNull
    @Size(max = 100)
    @Column(name = "team_name", length = 100, nullable = false)
    private String entryName;

    @ManyToOne(optional = false)
    private Driver driver;
    
    @ManyToOne(optional = false)
    private Team team;
    
    @ManyToOne
    private Team operatedBy;
    
    @ManyToOne(optional = false)
    private Chassis chassis;
    
    @ManyToOne(optional = false)
    private Engine engine;
    
    @ManyToOne(optional = false)
    private TyreProvider tyres;
    
    @ManyToOne
    private FuelProvider fuel;
    
    @ManyToOne
    private Category category;
    
    @ManyToOne
    private EventEdition eventEdition;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRaceNumber() {
		return raceNumber;
	}
    
    public EventEditionEntry raceNumber(Integer number) {
    	this.raceNumber = number;
    	return this;
    }

	public void setRaceNumber(Integer number) {
		this.raceNumber = number;
	}

	public String getEntryName() {
        return entryName;
    }

    public EventEditionEntry entryName(String entryName) {
        this.entryName = entryName;
        return this;
    }

    public void setEntryName(String entryName) {
        this.entryName = entryName;
    }

    public Driver getDriver() {
        return driver;
    }

    public EventEditionEntry driver(Driver driver) {
        this.driver = driver;
        return this;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Team getTeam() {
		return team;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public Team getOperatedBy() {
		return operatedBy;
	}

	public void setOperatedBy(Team operatedBy) {
		this.operatedBy = operatedBy;
	}

	public Chassis getChassis() {
		return chassis;
	}

	public void setChassis(Chassis chassis) {
		this.chassis = chassis;
	}

	public Engine getEngine() {
		return engine;
	}

	public void setEngine(Engine engine) {
		this.engine = engine;
	}

	public TyreProvider getTyres() {
		return tyres;
	}

	public void setTyres(TyreProvider tyres) {
		this.tyres = tyres;
	}

	public FuelProvider getFuel() {
		return fuel;
	}

	public void setFuel(FuelProvider fuel) {
		this.fuel = fuel;
	}

	public Category getCategory() {
		return category;
	}
	
	public EventEditionEntry category(Category category) {
		this.category = category;
		return this;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public EventEdition getEventEdition() {
		return eventEdition;
	}

	public EventEditionEntry eventEdition(EventEdition eventEdition) {
		this.eventEdition = eventEdition;
		return this;
	}
	
	public void setEventEdition(EventEdition eventEdition) {
		this.eventEdition = eventEdition;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEditionEntry eventEntry = (EventEditionEntry) o;
        if (eventEntry.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, eventEntry.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EventEntry{" +
            "id=" + id +
            ", entryName='" + entryName + "'" +
            ", team='" + team.getName() + "'" +
            ", operatedBy='" + (operatedBy != null ? operatedBy.getName() : "") + "'" +
            ", driver='" + driver.getFullName()  + "'" +
            ", chassis='" + chassis.getName() + "'" +
            ", engine='" + engine.getName() + "'" +
            ", tyres='" + (tyres != null ? tyres.getName() : "") + "'" +
            ", fuelProvider='" + (fuel != null ? fuel.getName() : "") + "'" +
            '}';
    }
}

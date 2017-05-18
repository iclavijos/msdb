package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.IndexedEmbedded;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.icesoft.msdb.web.rest.view.MSDBView;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Indexed
public class EventEditionEntry extends AbstractAuditingEntity implements Serializable {

	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @NotNull
    @Column(name = "race_number", nullable = false)
    private String raceNumber;

    @JsonView(MSDBView.SessionResultsView.class)
    @NotNull
    @Size(max = 100)
    @Column(name = "team_name", length = 100, nullable = false)
    @Field
    private String entryName;

    @JsonView(MSDBView.SessionResultsView.class)
    @ManyToMany(fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(
        name="DRIVERS_ENTRY",
        joinColumns=@JoinColumn(name="entry_id", referencedColumnName="ID"),
        inverseJoinColumns=@JoinColumn(name="driver_id", referencedColumnName="ID"))
    @IndexedEmbedded
    private List<Driver> drivers;
    
    @JsonView(MSDBView.SessionResultsView.class)
    @Column(name = "rookie")
    private Boolean rookie = false;
    
    @ManyToOne(optional = false)
    @IndexedEmbedded
    private Team team;
    
    @ManyToOne
    @IndexedEmbedded
    private Team operatedBy;
    
    @ManyToOne(optional = false)
    @IndexedEmbedded
    private Chassis chassis;
    
    @ManyToOne(optional = false)
    @IndexedEmbedded
    private Engine engine;
    
    @ManyToOne(optional = false)
    @IndexedEmbedded
    private TyreProvider tyres;
    
    @ManyToOne
    @IndexedEmbedded
    private FuelProvider fuel;
    
    @ManyToOne
    @IndexedEmbedded
    private Category category;
    
    @ManyToOne
    @IndexedEmbedded
    private EventEdition eventEdition;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRaceNumber() {
		return raceNumber;
	}
    
    public EventEditionEntry raceNumber(String number) {
    	this.raceNumber = number;
    	return this;
    }

	public void setRaceNumber(String number) {
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
    
    public Boolean getRookie() {
		return rookie;
	}

	public void setRookie(Boolean rookie) {
		this.rookie = rookie;
	}

    public List<Driver> getDrivers() {
        return drivers;
    }

    public EventEditionEntry drivers(List<Driver> drivers) {
    	if (this.drivers == null) {
    		this.drivers = drivers;
    		return this;
    	}
    	this.drivers.clear();
        if (drivers != null) {
        	this.drivers.addAll(drivers);
        }
        return this;
    }

    public void setDrivers(List<Driver> drivers) {
    	if (this.drivers == null) {
    		this.drivers = drivers;
    		return;
    	}
        this.drivers.clear();
        if (drivers != null) {
        	this.drivers.addAll(drivers);
        }
    }

    public Team getTeam() {
		return team;
	}
    
    public EventEditionEntry team(Team team) {
    	this.team = team;
    	return this;
    }

	public void setTeam(Team team) {
		this.team = team;
	}

	public Team getOperatedBy() {
		return operatedBy;
	}
	
	public EventEditionEntry operatedBy(Team operatedBy) {
		this.operatedBy = operatedBy;
		return this;
	}

	public void setOperatedBy(Team operatedBy) {
		this.operatedBy = operatedBy;
	}

	public Chassis getChassis() {
		return chassis;
	}
	
	public EventEditionEntry chassis(Chassis chassis) {
		this.chassis = chassis;
		return this;
	}

	public void setChassis(Chassis chassis) {
		this.chassis = chassis;
	}

	public Engine getEngine() {
		return engine;
	}
	
	public EventEditionEntry engine(Engine engine) {
		this.engine = engine;
		return this;
	}

	public void setEngine(Engine engine) {
		this.engine = engine;
	}

	public TyreProvider getTyres() {
		return tyres;
	}
	
	public EventEditionEntry tyres(TyreProvider tyres) {
		this.tyres = tyres;
		return this;
	}

	public void setTyres(TyreProvider tyres) {
		this.tyres = tyres;
	}

	public FuelProvider getFuel() {
		return fuel;
	}
	
	public EventEditionEntry fuel(FuelProvider fuel) {
		this.fuel = fuel;
		return this;
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
	
	@JsonProperty("driversName")
	@JsonView(MSDBView.SessionResultsView.class)
	public String getDriversName() {
		StringBuilder builder = new StringBuilder();
		int i = 0;
		for(Driver driver: drivers) {
			builder.append(driver.getName().toUpperCase().charAt(0))
				.append(". ").append(driver.getSurname());
			if (++i < drivers.size()) {
				builder.append(" / ");
			}
		}
		return builder.toString();
	}
	
	public EventEditionEntry createCopy(EventEditionEntry source) {
		EventEditionEntry result = new EventEditionEntry();
		result.category(source.getCategory())
			.chassis(source.getChassis());
		return result;
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
    	String driversStr = "";
    	if (eventEdition.isMultidriver()) {
    		driversStr = driversToString();
    	} else {
    		if (drivers != null && drivers.size() > 0) {
    			driversStr = drivers.get(0).getFullName();
    		}
    	}
        return "EventEntry{" +
            "id=" + id +
            ", entryName='" + entryName + "'" +
            ", team='" + team.getName() + "'" +
            ", operatedBy='" + (operatedBy != null ? operatedBy.getName() : "") + "'" +
            (eventEdition.isMultidriver() ? 
            	"drivers=[" + driversStr + "]"  : 
            	", driver='" + driversStr  + "'" ) +            
            ", chassis='" + chassis.getName() + "'" +
            ", engine='" + engine.getName() + "'" +
            ", tyres='" + (tyres != null ? tyres.getName() : "") + "'" +
            ", fuelProvider='" + (fuel != null ? fuel.getName() : "") + "'" +
            '}';
    }
    
    private String driversToString() {
    	StringBuffer buff = new StringBuffer();
    	for(Driver driver: drivers) {
    		buff.append(driver.getFullName()).append(", ");
    	}
    	return buff.toString();
    }
}

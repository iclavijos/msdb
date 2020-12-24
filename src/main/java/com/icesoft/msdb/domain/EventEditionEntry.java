package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A EventEntry.
 */
@Entity
@Table(name = "event_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "evententry")
@NamedEntityGraph(name="EventEntryPartial", attributeNodes= {
		@NamedAttributeNode(value="id"),
		@NamedAttributeNode(value="entryName"),
		@NamedAttributeNode(value="drivers"),
		@NamedAttributeNode(value="team"),
		@NamedAttributeNode(value="operatedBy"),
		@NamedAttributeNode(value="chassis"),
		@NamedAttributeNode(value="engine"),
		@NamedAttributeNode(value="tyres"),
		@NamedAttributeNode(value="fuel"),
		@NamedAttributeNode(value="category"),
		@NamedAttributeNode(value="eventEdition")
})
public class EventEditionEntry extends AbstractAuditingEntity implements Serializable {

	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "race_number", nullable = false)
    private String raceNumber;

    @NotNull
    @Size(max = 100)
    @Column(name = "team_name", length = 100, nullable = false)
    private String entryName;

    @OneToMany(mappedBy = "eventEntry", fetch = FetchType.EAGER)
    private Set<DriverEntry> drivers;

    @ManyToOne
    private Team team;

    @ManyToOne
    private Team operatedBy;

    @ManyToOne(optional = false)
    private Chassis chassis;

    @ManyToOne
    private Engine engine;

    @ManyToOne(optional = false)
    private TyreProvider tyres;

    @ManyToOne
    private FuelProvider fuel;

    @ManyToOne
    private Category category;

    @ManyToOne
    private EventEdition eventEdition;

    @Transient
    private byte[] carImage;

    @Column(name = "car_image_url")
    private String carImageUrl;

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

    public Set<DriverEntry> getDrivers() {
        return drivers;
    }

    public EventEditionEntry drivers(Set<DriverEntry> drivers) {
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

    public void setDrivers(Set<DriverEntry> drivers) {
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

	@JsonIgnore
	public String getManufacturer() {
		String chassisManufac = getChassis().getManufacturer();
		String engineManufac = Optional.ofNullable(getEngine()).map(e -> e.getManufacturer()).orElse("");

		if (chassisManufac.equals(engineManufac) || StringUtils.isBlank(engineManufac)) {
			return chassisManufac;
		} else {
			return chassisManufac + "/" + engineManufac;
		}
	}

	@JsonProperty("driversName")
	public String getDriversName() {
		StringBuilder builder = new StringBuilder();
		int i = 0;
		if (drivers != null) {
			for(DriverEntry driver: drivers) {
				builder.append(driver.getDriver().getName().toUpperCase().charAt(0))
					.append(". ").append(driver.getDriver().getSurname());
				if (++i < drivers.size()) {
					builder.append(" / ");
				}
			}
		}
		return builder.toString();
	}

	public byte[] getCarImage() {
		return carImage;
	}

	public void setCarImage(byte[] carImage) {
		this.carImage = carImage;
	}

	public String getCarImageUrl() {
		return carImageUrl;
	}

	public void setCarImageUrl(String carImageUrl) {
		this.carImageUrl = carImageUrl;
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
            ", team='" + (team != null ? team.getName() : "") + "'" +
            ", operatedBy='" + (operatedBy != null ? operatedBy.getName() : "") + "'" +
            	", drivers=[" + driversToString() + "]"  +
            ", chassis='" + chassis.getName() + "'" +
            ", engine='" + (engine != null ? engine.getName() : "") + "'" +
            ", tyres='" + (tyres != null ? tyres.getName() : "") + "'" +
            ", fuelProvider='" + (fuel != null ? fuel.getName() : "") + "'" +
            '}';
    }

    private String driversToString() {
    	StringBuffer buff = new StringBuffer();
    	for(DriverEntry driver: drivers) {
    		buff.append(driver.getDriver().getFullName()).append(", ");
    	}
    	return buff.toString();
    }
}

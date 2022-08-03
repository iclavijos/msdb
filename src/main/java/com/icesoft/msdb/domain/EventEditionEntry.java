package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.*;
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
@Data @EqualsAndHashCode(callSuper=false)
@Builder @AllArgsConstructor @NoArgsConstructor
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

    @EqualsAndHashCode.Exclude @ToString.Exclude
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

    private String driversToString() {
    	StringBuffer buff = new StringBuffer();
    	for(DriverEntry driver: drivers) {
    		buff.append(driver.getDriver().getFullName()).append(", ");
    	}
    	return buff.toString();
    }
}

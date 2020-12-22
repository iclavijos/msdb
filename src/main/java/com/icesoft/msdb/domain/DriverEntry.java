package com.icesoft.msdb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icesoft.msdb.domain.enums.DriverCategory;
import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="DRIVERS_ENTRY")
@Data
public class DriverEntry {

    @EmbeddedId
    @JsonIgnore
    private DriverEntryPK id;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @MapsId("driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "entry_id")
    @MapsId("driver_id")
    @JsonIgnore
    private EventEditionEntry eventEntry;

    @Column
    private Boolean rookie;

    @Column(name= "category")
    @Enumerated(EnumType.ORDINAL)
    private DriverCategory category;

    public void setEventEntry(EventEditionEntry entry) {
        this.eventEntry = entry;
        this.id = new DriverEntryPK(driver.getId(), eventEntry.getId());
    }
}

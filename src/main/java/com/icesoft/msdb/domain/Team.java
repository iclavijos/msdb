package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.search.annotations.Field;

/**
 * A Team.
 */
@Entity
@Table(name = "team")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "team")
public class Team extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 40)
    @Column(name = "name", length = 40, nullable = false)
    @Field
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    private String description;

    @Size(max = 100)
    @Column(name = "hq_location", length = 100)
    private String hqLocation;

    @Transient
    private byte[] logo;
    
    @Column
    private String logoUrl;

//    @ManyToMany
//    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//    @JoinTable(name = "team_participations",
//               joinColumns = @JoinColumn(name="teams_id", referencedColumnName="id"),
//               inverseJoinColumns = @JoinColumn(name="participations_id", referencedColumnName="id"))
//    @JsonIgnore
//    private Set<EventEditionEntry> participations = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Team name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Team description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHqLocation() {
        return hqLocation;
    }

    public Team hqLocation(String hqLocation) {
        this.hqLocation = hqLocation;
        return this;
    }

    public void setHqLocation(String hqLocation) {
        this.hqLocation = hqLocation;
    }

    public byte[] getLogo() {
        return logo;
    }

    public Team logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoUrl() {
    	return logoUrl;
    }
    
    public Team logoUrl(String logoUrl) {
    	this.logoUrl = logoUrl;
    	return this;
    }
    
    public void setLogoUrl(String logoUrl) {
    	this.logoUrl = logoUrl;
    }

//    public Set<EventEditionEntry> getParticipations() {
//        return participations;
//    }
//
//    public Team participations(Set<EventEditionEntry> eventEntries) {
//        this.participations = eventEntries;
//        return this;
//    }
//
//    public Team addParticipations(EventEditionEntry eventEntry) {
//        this.participations.add(eventEntry);
//        eventEntry.getParticipants().add(this);
//        return this;
//    }
//
//    public Team removeParticipations(EventEditionEntry eventEntry) {
//        this.participations.remove(eventEntry);
//        eventEntry.getParticipants().remove(this);
//        return this;
//    }
//
//    public void setParticipations(Set<EventEditionEntry> eventEntries) {
//        this.participations = eventEntries;
//    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Team team = (Team) o;
        if (team.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), team.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Team{" +
    		"id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", hqLocation='" + getHqLocation() + "'" +
            ", logoUrl='" + getLogoUrl() + "'" +
            '}';
    }
}

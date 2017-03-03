package com.icesoft.msdb.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Car.
 */
@Entity
@Table(name = "car")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "car")
public class Car implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(max = 50)
    @Column(name = "manufacturer", length = 50, nullable = false)
    private String manufacturer;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToOne
    private Engine engine;

    @ManyToOne
    private Chassis chassis;

    @ManyToOne
    private TyreProvider tyreProvider;

    @ManyToOne
    private FuelProvider fuelProvider;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Car name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public Car manufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
        return this;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public byte[] getImage() {
        return image;
    }

    public Car image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public Car imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Engine getEngine() {
        return engine;
    }

    public Car engine(Engine engine) {
        this.engine = engine;
        return this;
    }

    public void setEngine(Engine engine) {
        this.engine = engine;
    }

    public Chassis getChassis() {
        return chassis;
    }

    public Car chassis(Chassis chassis) {
        this.chassis = chassis;
        return this;
    }

    public void setChassis(Chassis chassis) {
        this.chassis = chassis;
    }

    public TyreProvider getTyreProvider() {
        return tyreProvider;
    }

    public Car tyreProvider(TyreProvider tyreProvider) {
        this.tyreProvider = tyreProvider;
        return this;
    }

    public void setTyreProvider(TyreProvider tyreProvider) {
        this.tyreProvider = tyreProvider;
    }

    public FuelProvider getFuelProvider() {
        return fuelProvider;
    }

    public Car fuelProvider(FuelProvider fuelProvider) {
        this.fuelProvider = fuelProvider;
        return this;
    }

    public void setFuelProvider(FuelProvider fuelProvider) {
        this.fuelProvider = fuelProvider;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Car car = (Car) o;
        if (car.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, car.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Car{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", manufacturer='" + manufacturer + "'" +
            ", image='" + image + "'" +
            ", imageContentType='" + imageContentType + "'" +
            '}';
    }
}

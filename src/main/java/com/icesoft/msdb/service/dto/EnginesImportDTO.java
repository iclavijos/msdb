package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Engine;

public class EnginesImportDTO {
	private String name;
    private String manufacturer;
    private Integer capacity;
    private String architecture;
    private Integer debutYear;
    private Boolean petrolEngine;
    private Boolean dieselEngine;
    private Boolean electricEngine;
    private Boolean otherEngine;
    private Boolean turbo;
    private String comments;
    private String derivedFromName;
    private String derivedFromManufacturer;
    
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public Integer getCapacity() {
		return capacity;
	}
	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}
	public String getArchitecture() {
		return architecture;
	}
	public void setArchitecture(String architecture) {
		this.architecture = architecture;
	}
	public Integer getDebutYear() {
		return debutYear;
	}
	public void setDebutYear(Integer debutYear) {
		this.debutYear = debutYear;
	}
	public Boolean getPetrolEngine() {
		return petrolEngine;
	}
	public void setPetrolEngine(Boolean petrolEngine) {
		this.petrolEngine = petrolEngine;
	}
	public Boolean getDieselEngine() {
		return dieselEngine;
	}
	public void setDieselEngine(Boolean dieselEngine) {
		this.dieselEngine = dieselEngine;
	}
	public Boolean getElectricEngine() {
		return electricEngine;
	}
	public void setElectricEngine(Boolean electricEngine) {
		this.electricEngine = electricEngine;
	}
	public Boolean getOtherEngine() {
		return otherEngine;
	}
	public void setOtherEngine(Boolean otherEngine) {
		this.otherEngine = otherEngine;
	}
	public Boolean getTurbo() {
		return turbo;
	}
	public void setTurbo(Boolean turbo) {
		this.turbo = turbo;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getDerivedFromName() {
		return derivedFromName;
	}
	public void setDerivedFromName(String derivedFromName) {
		this.derivedFromName = derivedFromName;
	}
	public String getDerivedFromManufacturer() {
		return derivedFromManufacturer;
	}
	public void setDerivedFromManufacturer(String derivedFromManufacturer) {
		this.derivedFromManufacturer = derivedFromManufacturer;
	}
	
	public Engine buildEngine() {
		Engine engine = new Engine();
		
		engine.setName(this.getName());
		engine.setManufacturer(this.manufacturer);
		engine.setArchitecture(this.architecture);
		engine.setCapacity(this.capacity);
		engine.setDebutYear(this.debutYear);
		engine.setPetrolEngine(this.petrolEngine);
		engine.setDieselEngine(this.dieselEngine);
		engine.setElectricEngine(this.electricEngine);
		engine.setOtherEngine(this.otherEngine);
		engine.setTurbo(this.turbo);
		
		return engine;
	}
}

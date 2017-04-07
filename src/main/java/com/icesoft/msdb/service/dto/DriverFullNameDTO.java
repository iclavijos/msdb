package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Driver;

public class DriverFullNameDTO {

	private final Driver driver;
	
	public DriverFullNameDTO(Driver driver) {
		this.driver = driver;
	}
	
	public String getFullName() {
		return driver.getName() + " " + driver.getSurname();
	}
	
	public Driver getDriver() {
		return driver;
	}
}

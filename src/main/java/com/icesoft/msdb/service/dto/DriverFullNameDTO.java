package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Driver;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class DriverFullNameDTO {

	private final Driver driver;

	public String getFullName() {
		return driver.getName() + " " + driver.getSurname();
	}

}

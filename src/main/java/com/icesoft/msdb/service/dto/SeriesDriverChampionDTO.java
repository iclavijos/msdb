package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.Driver;
import lombok.Data;

@Data
public class SeriesDriverChampionDTO {

	private static final String CHAMPION_IMAGE_URL_TEMPLATE = "https://res.cloudinary.com/msdb-cloud/image/upload/w_160/l_driver:%s,w_120,h_120,g_center,c_thumb,r_max,y_-7/crown.png";

	private String driverName;
	private Long driverId;

	public SeriesDriverChampionDTO(Driver driver) {
		this.driverName = driver.getFullName();
		this.driverId = driver.getId();
	}

	public String getDriverImage() {
		return String.format(CHAMPION_IMAGE_URL_TEMPLATE, this.driverId);
	}

}

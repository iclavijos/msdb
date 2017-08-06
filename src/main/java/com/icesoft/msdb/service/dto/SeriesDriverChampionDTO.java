package com.icesoft.msdb.service.dto;

public class SeriesDriverChampionDTO {
	
	private static final String CHAMPION_IMAGE_URL_TEMPLATE = "https://res.cloudinary.com/msdb-cloud/image/upload/w_160/l_driver:%s,w_120,h_120,g_center,c_thumb,r_max,y_-7/crown.png";

	private String driverName;
	private Long driverId;
	
	public String getDriverName() {
		return driverName;
	}
	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}
	public Long getDriverId() {
		return driverId;
	}
	public void setDriverId(Long driverId) {
		this.driverId = driverId;
	}
	public String getDriverImage() {
		return String.format(CHAMPION_IMAGE_URL_TEMPLATE, this.driverId);
	}
	
}

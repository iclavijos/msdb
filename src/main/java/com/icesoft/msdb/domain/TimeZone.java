package com.icesoft.msdb.domain;

public class TimeZone {

	private String countryName;
	private String zoneName;
	private Long gmtOffset;
	
	public TimeZone() {
		
	}
	
	public TimeZone(String countryName, String zoneName, Long gmtOffset) {
		this.countryName = countryName;
		this.zoneName = zoneName;
		this.gmtOffset = gmtOffset;
	}

	public String getCountryName() {
		return countryName;
	}

	public String getZoneName() {
		return zoneName;
	}

	public String getGmtOffset() {
		if (gmtOffset == 0) {
			return "UTC";
		}
		Float hoursOff = (float)gmtOffset / 3600L;
		StringBuilder strBuilder = new StringBuilder("UTC ");
		if (gmtOffset > 0) {
			strBuilder.append("+");
		} else {
			strBuilder.append("-");
		}
		int iPart = hoursOff.intValue();
		strBuilder.append(String.format("%02d", Math.abs(iPart)))
			.append(":")
			.append(String.format("%02d", (int)(60 * (Math.abs(hoursOff - iPart)))));
		return strBuilder.toString();
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}

	public void setZoneName(String zoneName) {
		this.zoneName = zoneName;
	}

	public void setGmtOffset(Long gmtOffset) {
		this.gmtOffset = gmtOffset;
	}
}

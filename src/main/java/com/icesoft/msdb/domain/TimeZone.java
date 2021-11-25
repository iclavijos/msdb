package com.icesoft.msdb.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeZone implements Comparable<TimeZone> {

	private String countryName;
	private String zoneName;
	private Long gmtOffset;

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

    @Override
    public int compareTo(TimeZone tz) {
        assert tz instanceof TimeZone;

        return Optional.ofNullable(tz)
            .map(value -> gmtOffset.compareTo(tz.gmtOffset))
            .orElse(0);
    }
}

package com.icesoft.msdb.domain;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
public class LapInfo {

    private static final Pattern LAPTIME_REGEX = Pattern.compile("(([0-9]+)(:|'))?(([0-9]+)(:|'))?([0-9]+)\\.([0-9]+)");
    private static final Pattern LAPTIME_MILLIS_REGEX = Pattern.compile("[0-9]+");

	private String raceNumber;
	private String driverName;
	private Integer lapNumber;
	private Long lapTime;
	private Boolean pitstop;
	private Boolean personalBest = false;
	private Boolean fastLap = false;
	private Boolean fastestLap = false;
	private Long s1;
	private Long s2;
	private Long s3;
	private String category;

	public LapInfo() {

	}

	public LapInfo(String raceNumber, String driverName, Integer lapNumber, Long lapTime, Boolean pitstop) {
		this.raceNumber = raceNumber;
		this.driverName = camelCaseDriverName(driverName);
		this.lapNumber = lapNumber;
		this.lapTime = lapTime;
		this.pitstop = pitstop;
	}

	public String getRaceNumber() {
		return raceNumber;
	}

	public Integer getLapNumber() {
		return lapNumber;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = camelCaseDriverName(driverName);
	}

	public Long getLapTime() {
		return lapTime;
	}

	public Boolean getPitstop() {
		return Optional.ofNullable(pitstop).orElse(Boolean.FALSE);
	}

	public void setRaceNumber(String raceNumber) {
		this.raceNumber = raceNumber;
	}

	public void setLapNumber(Integer lapNumber) {
		this.lapNumber = lapNumber;
	}

	public void setLapTime(Long lapTime) {
		this.lapTime = lapTime;
	}

	public void setPitstop(String pitstop) {
	    this.pitstop = pitstop != null &&
            (pitstop.equalsIgnoreCase("b") || Boolean.parseBoolean(pitstop));
	}

	public Boolean getPersonalBest() {
		return personalBest;
	}

	public void setPersonalBest(Boolean personalBest) {
		this.personalBest = personalBest;
	}

	public Boolean getFastLap() {
		return fastLap;
	}

	public void setFastLap(Boolean fastLap) {
		this.fastLap = fastLap;
	}

	public Boolean getFastestLap() {
		return fastestLap;
	}

	public void setFastestLap(Boolean fastestLap) {
		this.fastestLap = fastestLap;
	}

	public void setLapTime(String lapTime) {
        this.lapTime = lapTimeStrToLong(lapTime);
    }

    public void setS1(String s1) {
	    this.s1 = lapTimeStrToLong(s1);
    }

    public void setS2(String s2) {
        this.s2 = lapTimeStrToLong(s2);
    }

    public void setS3(String s3) {
        this.s3 = lapTimeStrToLong(s3);
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    private Long lapTimeStrToLong(String lapTime) {
        Matcher m = LAPTIME_REGEX.matcher(lapTime);
        long timeMillis = 0;
        if (!m.matches()) {
            Matcher mMillis = LAPTIME_MILLIS_REGEX.matcher(lapTime);
            if (!mMillis.matches()) {
                log.warn("Ignoring laptime of lapInfo {}", this);
                System.out.println("Ignoring laptime " + lapTime);
            } else {
                return Long.parseLong(lapTime);
            }
        } else {
            timeMillis += Long.parseLong(m.group(8));
            timeMillis += Long.parseLong(m.group(7)) * 1000;
            if (m.group(5) != null) {
                // Time has hours
                timeMillis += Long.parseLong(m.group(5)) * 60 * 1000;
                timeMillis += Long.parseLong(m.group(2)) * 60 * 60 * 1000;
            } else {
                if (m.group(2) != null) {
                    timeMillis += Long.parseLong(m.group(2)) * 60 * 1000;
                }
            }
        }

        return timeMillis;
    }

    @Override
    public String toString() {
        return "LapInfo{" +
            "raceNumber='" + raceNumber + '\'' +
            ", driverName='" + driverName + '\'' +
            ", lapNumber=" + lapNumber +
            ", lapTime=" + lapTime +
            ", pitstop=" + pitstop +
            ", personalBest=" + personalBest +
            ", fastLap=" + fastLap +
            ", fastestLap=" + fastestLap +
            ", s1=" + s1 +
            ", s2=" + s2 +
            ", s3=" + s3 +
            ", category=" + category +
            '}';
    }

    public Long getS1() {
        return s1;
    }

    public void setS1(Long s1) {
        this.s1 = s1;
    }

    public Long getS2() {
        return s2;
    }

    public void setS2(Long s2) {
        this.s2 = s2;
    }

    public Long getS3() {
        return s3;
    }

    public void setS3(Long s3) {
        this.s3 = s3;
    }

    private String camelCaseDriverName(String driverName) {
	    List<String> items = Arrays.asList(StringUtils.split(driverName, " "));
	    String result = items.get(0).substring(0, 1).toUpperCase();
	    return result + ". " + items.subList(1, items.size()).stream()
            .map(name -> name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase())
            .collect(Collectors.joining(" "));
    }

}

package com.icesoft.msdb.domain;

public class LapInfo {

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

	public LapInfo() {

	}

	public LapInfo(String raceNumber, String driverName, Integer lapNumber, Long lapTime, Boolean pitstop) {
		this.raceNumber = raceNumber;
		this.driverName = driverName;
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
		this.driverName = driverName;
	}

	public Long getLapTime() {
		return lapTime;
	}

	public Boolean getPitstop() {
		return pitstop;
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

	public void setPitstop(Boolean pitstop) {
		this.pitstop = pitstop;
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

}

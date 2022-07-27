package com.icesoft.msdb.domain.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DurationType {
	MINUTES("minutes"),
	HOURS("hours"),
	KMS("kms"),
	MILES("miles"),
	LAPS("laps");

    private final String desc;

    DurationType(String desc) {
        this.desc = desc;
    }

    @JsonValue
    public String toString() {
        return desc;
    }

    public static DurationType fromDesc(String desc) {
        switch (desc) {
            case "minutes":
                return MINUTES;
            case "hours":
                return HOURS;
            case "kms":
                return KMS;
            case "miles":
                return MILES;
            case "laps":
                return LAPS;
            default:
                throw new IllegalArgumentException(desc + " is not a valid DurationType");
        }
    }
}

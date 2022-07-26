package com.icesoft.msdb.domain.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SessionType {
	PRACTICE("practice"),
	QUALIFYING("qualifying"),
	RACE("race"),
	QUALIFYING_RACE("qualifyingRace"),
    STAGE("stage");

    private final String desc;

    SessionType(String desc) {
        this.desc = desc;
    }

    @JsonValue
    public String toString() {
        return desc;
    }

    public static SessionType fromDesc(String desc) {
        switch (desc) {
            case "practice":
                return PRACTICE;
            case "qualifying":
                return QUALIFYING;
            case "race":
                return RACE;
            case "qualifyingRace":
                return QUALIFYING_RACE;
            case "stage":
                return STAGE;
            default:
                throw new IllegalArgumentException(desc + " is not a valid SessionType");
        }
    }

}

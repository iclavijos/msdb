package com.icesoft.msdb.domain.enums;

public enum EventStatusType {
    ONGOING("O"), SUSPENDED("S"), CANCELLED("C");

    private String code;

    private EventStatusType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}

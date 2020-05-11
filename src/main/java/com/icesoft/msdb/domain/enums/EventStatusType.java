package com.icesoft.msdb.domain.enums;

import java.util.HashMap;
import java.util.Map;

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

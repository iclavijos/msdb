package com.icesoft.msdb.domain.enums;

import java.util.HashMap;
import java.util.Map;

public enum SessionType {
	PRACTICE(1),
	QUALIFYING(2),
	RACE(3);
	
	private int value;
    private static Map<Integer, SessionType> map = new HashMap<>();

    private SessionType(int value) {
        this.value = value;
    }

    static {
        for (SessionType pageType : SessionType.values()) {
            map.put(pageType.value, pageType);
        }
    }

    public static SessionType valueOf(int pageType) {
        return map.get(pageType);
    }

    public int getValue() {
        return value;
    }
}

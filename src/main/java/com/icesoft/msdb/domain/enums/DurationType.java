package com.icesoft.msdb.domain.enums;

import java.util.HashMap;
import java.util.Map;

public enum DurationType {
	MINUTES(1),
	HOURS(2),
	KMs(3),
	MILES(4),
	LAPS(5);
	
	private int value;
    private static Map<Integer, DurationType> map = new HashMap<>();

    private DurationType(int value) {
        this.value = value;
    }

    static {
        for (DurationType pageType : DurationType.values()) {
            map.put(pageType.value, pageType);
        }
    }

    public static DurationType valueOf(int pageType) {
        return map.get(pageType);
    }

    public int getValue() {
        return value;
    }
}

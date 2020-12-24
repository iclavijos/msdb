package com.icesoft.msdb.domain.enums;

import java.util.HashMap;
import java.util.Map;

public enum DriverCategory {
    PRO(1),
    AM(2),
    PLATINUM(3),
    GOLD(4),
    SILVER(5),
    BRONZE(6);

    private int value;
    private static Map<Integer, DriverCategory> map = new HashMap<>();

    private DriverCategory(int value) {
        this.value = value;
    }

    static {
        for (DriverCategory pageType : DriverCategory.values()) {
            map.put(pageType.value, pageType);
        }
    }

    public static DriverCategory valueOf(int pageType) {
        return map.get(pageType);
    }

    public int getValue() {
        return value;
    }
}

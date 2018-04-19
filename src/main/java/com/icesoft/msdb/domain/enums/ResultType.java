package com.icesoft.msdb.domain.enums;

import java.util.HashMap;
import java.util.Map;

public enum ResultType {

	DNF(900),
	DNS(901),
	DSQ(902),
	NC(800);
	
	private int value;
    private static Map<Integer, ResultType> map = new HashMap<>();

    private ResultType(int value) {
        this.value = value;
    }

    static {
        for (ResultType resultType : ResultType.values()) {
            map.put(resultType.value, resultType);
        }
    }

    public static ResultType valueOf(int resultType) {
        return map.get(resultType);
    }

    public String getStringValue() {
        switch(value) {
        case 800: return "NC";
        case 900: return "DNF";
        case 901: return "DNS";
        case 902: return "DSQ";
        default: return Integer.toString(value);
        }
    }
}

package com.icesoft.msdb.repository.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class PointsConverter implements AttributeConverter<int[], String> {

	@Override
	public String convertToDatabaseColumn(int[] points) {
		String result = "";
		for(int value : points) {
			result += value + "|";
		}
		return result;
	}

	@Override
	public int[] convertToEntityAttribute(String dbData) {
		String[] tmp = dbData.split("\\|");
		int[] result = new int[tmp.length];
		for(int i = 0; i < result.length; i++) {
			result[i] = Integer.parseInt(tmp[i]);
		}
		return result;
	}

}

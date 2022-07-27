package com.icesoft.msdb.repository.converter;

import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.SessionType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class DurationTypeConverter implements AttributeConverter<DurationType, String> {
    @Override
    public String convertToDatabaseColumn(DurationType durationType) {
        if (durationType == null) {
            return null;
        } else {
            return durationType.toString();
        }
    }

    @Override
    public DurationType convertToEntityAttribute(String s) {
        return DurationType.fromDesc(s);
    }
}

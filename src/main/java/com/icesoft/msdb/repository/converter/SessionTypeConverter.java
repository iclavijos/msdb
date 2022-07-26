package com.icesoft.msdb.repository.converter;

import com.icesoft.msdb.domain.enums.SessionType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class SessionTypeConverter implements AttributeConverter<SessionType, String> {
    @Override
    public String convertToDatabaseColumn(SessionType sessionType) {
        if (sessionType == null) {
            return null;
        } else {
            return sessionType.toString();
        }
    }

    @Override
    public SessionType convertToEntityAttribute(String s) {
        return SessionType.fromDesc(s);
    }
}

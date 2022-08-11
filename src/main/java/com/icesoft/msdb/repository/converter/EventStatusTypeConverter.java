package com.icesoft.msdb.repository.converter;

import com.icesoft.msdb.domain.enums.EventStatusType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class EventStatusTypeConverter implements AttributeConverter<EventStatusType, String> {

    @Override
    public String convertToDatabaseColumn(EventStatusType status) {
        if (status == null) {
            return null;
        }
        return status.getCode();
    }

    @Override
    public EventStatusType convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }

        return Stream.of(EventStatusType.values())
            .filter(c -> c.getCode().equals(code))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }

}

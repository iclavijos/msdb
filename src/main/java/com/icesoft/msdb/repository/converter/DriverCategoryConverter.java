package com.icesoft.msdb.repository.converter;

import com.icesoft.msdb.domain.enums.DriverCategory;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DriverCategoryConverter implements AttributeConverter<DriverCategory, Integer> {

    @Override
    public Integer convertToDatabaseColumn(DriverCategory category) {
        if (category == null) return 0;
        return category.getValue();
    }

    @Override
    public DriverCategory convertToEntityAttribute(Integer dbData) {
        if (dbData == null || dbData == 0) return null;

        return DriverCategory.valueOf(dbData);
    }

}

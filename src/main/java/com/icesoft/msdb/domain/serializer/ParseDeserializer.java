package com.icesoft.msdb.domain.serializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class ParseDeserializer extends StdDeserializer<LocalDate> {

	private static final long serialVersionUID = -2323632016192386886L;
	
	private static final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	public ParseDeserializer() {
        super(LocalDate.class);
    }

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
    	if (!StringUtils.isBlank(p.getValueAsString())) {
    		return LocalDate.parse(p.getValueAsString(), dtf);
    	} else {
    		return null;
    	}
    }
}
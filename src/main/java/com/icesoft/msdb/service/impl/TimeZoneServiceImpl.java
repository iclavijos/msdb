package com.icesoft.msdb.service.impl;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.TimeZoneApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.service.TimeZoneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.TimeZone;

@Service
public class TimeZoneServiceImpl implements TimeZoneService {

    private static final Logger log = LoggerFactory.getLogger(TimeZoneServiceImpl.class);

    @Override
    public String getTimeZone(String location, String countryCode) {
        GeoApiContext context = new GeoApiContext().setApiKey("AIzaSyBrTxr6pxxOtRuZHTZ_AGt0xTPUp8u-3y0");
        GeocodingResult[] results;
        try {
            results = GeocodingApi.geocode(context, location + ", " + countryCode).await();
            if (results == null || results.length == 0) {
                throw new MSDBException("No geolocation could be found for the provided information");
            }
            TimeZone timeZone = TimeZoneApi.getTimeZone(context, results[0].geometry.location).await();
            return timeZone.getID();

        } catch (ApiException | InterruptedException | IOException e) {
            log.error("Error accessing Google Geolocation API", e);
            throw new MSDBException("Problems trying to retrieve geolocation information");
        }
    }
}

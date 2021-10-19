package com.icesoft.msdb.service.impl;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.TimeZoneApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.Geometry;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.service.GeoLocationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
public class GeoLocationServiceImpl implements GeoLocationService {

    private static final Logger log = LoggerFactory.getLogger(GeoLocationServiceImpl.class);
    private final GeoApiContext context;

    @Override
    public Geometry getGeolocationInformation(Racetrack racetrack) {
        GeocodingResult[] results;
        try {
            results = GeocodingApi.geocode(context,
                racetrack.getName() + ", " + racetrack.getLocation() + ", " + racetrack.getCountryCode()).await();
            if (results == null || results.length == 0) {
                throw new MSDBException("No geolocation could be found for racetrack " + racetrack.getName());
            }
            return results[0].geometry;

        } catch (ApiException | InterruptedException | IOException e) {
            log.error("Error accessing Google Geolocation API", e);
            throw new MSDBException("Problems trying to retrieve geolocation information");
        }
    }

    @Override
    public String getTimeZone(Geometry geometry) {
        try {
            TimeZone timeZone = TimeZoneApi.getTimeZone(context, geometry.location).await();
            return timeZone.getID();
        } catch (ApiException | InterruptedException | IOException e) {
            log.error("Error accessing Google Geolocation API", e);
            throw new MSDBException("Problems trying to retrieve geolocation information");
        }
    }

}

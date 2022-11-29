package com.icesoft.msdb.service;

import com.google.maps.model.Geometry;
import com.icesoft.msdb.domain.Racetrack;

public interface GeoLocationService {

    Geometry getGeolocationInformation(Racetrack racetrack);

    Geometry getGeolocationInformation(String location);

    Geometry getGeolocationInformation(Double longitude, Double latitude);

    String getTimeZone(Geometry geometry);

}

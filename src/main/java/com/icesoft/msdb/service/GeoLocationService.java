package com.icesoft.msdb.service;

import com.google.maps.model.Geometry;
import com.icesoft.msdb.domain.Racetrack;

public interface GeoLocationService {

    Geometry getGeolocationInformation(Racetrack racetrack);

    Geometry getGeolocationInformation(String location);

    String getTimeZone(Geometry geometry);

}

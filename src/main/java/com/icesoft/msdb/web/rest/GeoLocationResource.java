package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.service.GeoLocationService;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@Transactional(readOnly=true)
public class GeoLocationResource {

    private final GeoLocationService service;

    @GetMapping("/timezone/{location}")
    @Timed
    public ResponseEntity<String> getTimeZone(@PathVariable String location) {
        return ResponseEntity.ok(service.getTimeZone(service.getGeolocationInformation(location)));
    }
}

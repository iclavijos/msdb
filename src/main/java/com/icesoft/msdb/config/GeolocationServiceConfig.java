package com.icesoft.msdb.config;

import com.google.maps.GeoApiContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeolocationServiceConfig {

    private final Logger log = LoggerFactory.getLogger(GeolocationServiceConfig.class);

    private ApplicationProperties appProperties;

    public GeolocationServiceConfig(ApplicationProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public GeoApiContext geoApiContext() {
        return new GeoApiContext.Builder()
            .apiKey(appProperties.getGeolocation().getKey())
            .build();
    }
}

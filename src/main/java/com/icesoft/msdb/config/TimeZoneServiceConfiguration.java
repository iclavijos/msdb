package com.icesoft.msdb.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class TimeZoneServiceConfiguration {

    private final Logger log = LoggerFactory.getLogger(TimeZoneServiceConfiguration.class);

    private final ApplicationProperties appProperties;

    @Bean
    public String getTimeZoneServiceUrl() {
        return appProperties.getTimeZone().getServiceUrl();
    }
}

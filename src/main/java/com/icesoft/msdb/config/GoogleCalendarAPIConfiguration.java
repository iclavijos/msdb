package com.icesoft.msdb.config;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.icesoft.msdb.MSDBException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Configuration
@Slf4j
public class GoogleCalendarAPIConfiguration {

    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Bean
    public Calendar googleCalendarAPI() {
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

            GoogleCredential credential = GoogleCredential
                .fromStream(new ClassPathResource("motorsport-database-calendar-1151-b7724d0f8663.json").getInputStream())
                .createScoped(CalendarScopes.all());

            // Construct the Calendar service object.
            return new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName("MotorSports Database Calendars")
                .build();
        } catch (IOException | GeneralSecurityException e) {
            log.error("Couldn't instantiate Google Calendar client", e);
            throw new MSDBException("Google Calendar initialization exception: " +  e.getLocalizedMessage());
        }
    }

}

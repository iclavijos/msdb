package com.icesoft.msdb.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
@Slf4j
public class FirebaseConfiguration {

    @Bean
    FirebaseMessaging firebaseMessaging() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials
            .fromStream(new ClassPathResource("msdb-firebase-service-acc.json").getInputStream());
        FirebaseOptions firebaseOptions = FirebaseOptions
            .builder()
            .setCredentials(googleCredentials)
            .build();
        FirebaseApp app = null;
        if (FirebaseApp.getApps().isEmpty()) {
            log.debug("Initializing Firebase as apps list is empty");
            app = FirebaseApp.initializeApp(firebaseOptions, "com.icesoft.msdb.client");
        } else {
            log.debug("Initializing Firebase with {} apps in the list", FirebaseApp.getApps().size());
            app = FirebaseApp.getApps().get(0);
        }
        return FirebaseMessaging.getInstance(app);
    }
}

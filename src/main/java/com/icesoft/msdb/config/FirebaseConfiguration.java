package com.icesoft.msdb.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
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
        if(FirebaseApp.getApps().isEmpty()) {
            app = FirebaseApp.initializeApp(firebaseOptions, "com.icesoft.msdb.client");
        }else {
            app = FirebaseApp.initializeApp(firebaseOptions);
        }
        return FirebaseMessaging.getInstance(app);
    }
}

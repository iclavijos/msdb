package com.icesoft.msdb.service.impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.service.MessagingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.ResourceBundle;

@Service
@Slf4j
public class FirebaseMessagingServiceImpl implements MessagingService {

    private final FirebaseMessaging firebaseMessaging;

    public FirebaseMessagingServiceImpl(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    @Override
    public void sendSessionNotification(User user, EventSession session) {
        user.getDeviceIds().forEach(deviceId -> {
            String messageId = null;
            try {
                Message message = Message
                    .builder()
                    .setToken(deviceId)
                    .setNotification(Notification.builder().build())
                    .putData("eventName", session.getEventEdition().getLongEventName())
                    .putData("sessionName", session.getName())
                    .putData("startTime", session.getSessionStartTime().toString())
                    .build();
                messageId = firebaseMessaging.send(message);
                log.debug("Generated messageId: {}", messageId);
            } catch (FirebaseMessagingException e) {
                log.error("Couldn't send notification message", e);
            }
        });
    }

}

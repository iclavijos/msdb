package com.icesoft.msdb.service.impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.service.MessagingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseMessagingServiceImpl implements MessagingService {

    private final FirebaseMessaging firebaseMessaging;

    public FirebaseMessagingServiceImpl(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    @Override
    public void sendNotification(User user, String something) {
        // eyyokUUGT4i17MqI_KiYb0:APA91bHmEHVCBgDYu001f4iik4C8LFVxYd6YwcXQKm6jLjjHWrQBwuGoLXv6huQ4dSA9vSoxGoZzs3UEO3GFQNLHBBz1Y_l_7HS8lXRIbpKvaPNFT98T1zGm1WkrcX6T1mOWnB7urDSa
        Notification notification = Notification
            .builder()
            .setTitle("Upcoming session")
            .setBody(something)
            .build();

        Message message = Message
            .builder()
            .setToken("eyyokUUGT4i17MqI_KiYb0:APA91bHmEHVCBgDYu001f4iik4C8LFVxYd6YwcXQKm6jLjjHWrQBwuGoLXv6huQ4dSA9vSoxGoZzs3UEO3GFQNLHBBz1Y_l_7HS8lXRIbpKvaPNFT98T1zGm1WkrcX6T1mOWnB7urDSa")
            .setNotification(notification)
            .build();

        try {
            String messageId = firebaseMessaging.send(message);
            log.debug("Generated messageId: {}", messageId);
        } catch (FirebaseMessagingException e) {
            log.error("Couldn't send notification message", e);
        }
    }

}

package com.icesoft.msdb.service.impl;

import com.google.firebase.messaging.*;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.service.MessagingService;
import com.icesoft.msdb.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseMessagingServiceImpl implements MessagingService {

    private final FirebaseMessaging firebaseMessaging;

    @Autowired
    private UserService userService;

    public FirebaseMessagingServiceImpl(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    @Override
    public void sendSessionNotification(User user, EventSession session) {
        log.trace("Sending notification to user {} about session {} of {}", user.getFirstName(), session.getName(), session.getEventEdition().getLongEventName());

        user.getDeviceIds().forEach(deviceId -> {
            try {
                Message.Builder builder = Message.builder();
                builder
                    .setToken(deviceId)
                    .putData("eventEditionId", session.getEventEdition().getId().toString())
                    .putData("sessionId", session.getId().toString())
                    .putData("eventName", session.getEventEdition().getLongEventName())
                    .putData("startTime", Long.toString(session.getSessionStartTimeDate().toEpochSecond()))
                    .putData("seriesLogoUrl", session.getEventEdition().getSeriesEditions().stream()
                        .map(series -> series.getLogoUrl()).findFirst().orElseGet(null)
                    );

                if (session.getEventEdition().getEvent().isRally()) {
                    // It's a rally
                    builder.putData("sessionName", String.format("%s - %s", session.getShortname(), session.getName()));
                    builder.putData("distance", session.getDuration().toString());
                    builder.putData("racetrack", session.getEventEdition().getLocation());
                } else if (session.getEventEdition().getEvent().isRaid()) {
                    builder.putData("sessionName", String.format("%s - %s", session.getShortname(), session.getName()));
                    builder.putData("distance", session.getDuration().toString());
                    builder.putData("totalDistance", session.getTotalDuration().toString());
                } else {
                    builder.putData("sessionName", session.getName());
                    builder.putData("endTime", Long.toString(session.getSessionEndTime().toEpochSecond()));
                    builder.putData("racetrack", session.getEventEdition().getTrackLayout().getRacetrack().getName());
                    builder.putData("racetrackLayoutUrl", session.getEventEdition().getTrackLayout().getLayoutImageUrl());
                }
                builder.putData("rally", Boolean.toString(session.getEventEdition().getEvent().isRally()));
                builder.putData("raid", Boolean.toString(session.getEventEdition().getEvent().isRaid()));

                Message message = builder.build();

                firebaseMessaging.send(message);
                log.debug("Sent message to device {}", deviceId.substring(0, 10));
            } catch (FirebaseMessagingException e) {
                log.error("Couldn't send notification message to device {} of user {} because {}", deviceId, user.getEmail(), e.getMessagingErrorCode());
                if ("UNREGISTERED".equals(e.getMessagingErrorCode().name())) {
                    userService.removeDevice(user, deviceId);
                }
            }
        });
    }

}

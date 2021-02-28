package com.icesoft.msdb.service.impl;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.firebase.messaging.*;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;
import com.icesoft.msdb.domain.User;
import com.icesoft.msdb.service.MessagingService;
import com.icesoft.msdb.service.UserService;
import com.icesoft.msdb.service.dto.UserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

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
            String messageId = null;
            try {
                Message message = Message
                    .builder()
                    .setToken(deviceId)
                    .putData("eventEditionId", session.getEventEdition().getId().toString())
                    .putData("sessionId", session.getId().toString())
                    .putData("eventName", session.getEventEdition().getLongEventName())
                    .putData("sessionName", session.getName())
                    .putData("startTime", session.getSessionStartTime().toString())
                    .putData("endTime", Long.toString(session.getSessionEndTime().toEpochSecond()))
                    .putData("racetrack", session.getEventEdition().getTrackLayout().getRacetrack().getName())
                    .putData("racetrackLayoutUrl", session.getEventEdition().getTrackLayout().getLayoutImageUrl())
                    .putData("seriesLogoUrl", session.getEventEdition().getSeriesEditions().stream()
                        .map(series -> series.getSeries().getLogoUrl()).findFirst().orElse(null)
                    )
                    .build();

                messageId = firebaseMessaging.send(message);
                log.debug("Generated messageId: {}", messageId);
            } catch (FirebaseMessagingException e) {
                log.error("Couldn't send notification message to device {} of user {} because {}", deviceId, user.getEmail(), e.getMessagingErrorCode());
                if (e.getMessagingErrorCode().name().equals("UNREGISTERED")) {
                    userService.removeDevice(user, deviceId);
                }
            }
        });
    }

}

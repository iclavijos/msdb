package com.icesoft.msdb.service;

import static org.mockito.Mockito.*;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.subscriptions.Sessions;
import com.icesoft.msdb.repository.jpa.EventSessionRepository;
import com.icesoft.msdb.repository.jpa.UserRepository;
import com.icesoft.msdb.repository.jpa.UserSubscriptionRepository;
import com.icesoft.msdb.repository.mongo.subscriptions.SessionsRepository;
import com.icesoft.msdb.service.impl.SubscriptionsServiceImpl;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@SpringBootTest(classes = { MotorsportsDatabaseApp.class })
@ExtendWith(SpringExtension.class)
public class SubscriptionsServiceTest {

    @MockBean
    private SessionsRepository sessionsRepository;
    @MockBean
    private EventSessionRepository eventSessionRepository;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private UserSubscriptionRepository userSubscriptionRepository;
    @MockBean
    private MessagingService messagingService;

    @Autowired
    private TelegramSenderService telegramSenderService;
    @MockBean
    private TelegramBot telegramBot;

    @Autowired
    private SubscriptionsServiceImpl subscriptionsService;

    private OffsetDateTime now = OffsetDateTime.of(2022, 9, 10, 0, 0, 0, 0, ZoneOffset.UTC);
    private long epochSecs15m = now.plusMinutes(15).toEpochSecond();
    private long epochSecs1h = now.plusHours(1).toEpochSecond();
    private long epochSecs3h = now.plusHours(3).toEpochSecond();

    private Sessions sessions15min;
    private Sessions sessions1hour;
    private Sessions sessions3hour;

    private Map<Long, EventSession> eventSessions = new HashMap<>();

                                                                private Series series = Series.builder()
                                                                    .id(19L)
                                                                    .name("Series 1")
                                                                    .shortname("S1")
                                                                    .build();

    @Mock
    private SendResponse telegramSendResponse;

    @BeforeEach
    public void init() {
        sessions15min = new Sessions(epochSecs15m);
        sessions1hour = new Sessions(epochSecs1h);
        sessions3hour = new Sessions(epochSecs3h);

        eventSessions.put(1L, EventSession.builder()
            .id(1L)
            .duration(20f)
            .name("Session 3")
            .shortname("S3")
            .sessionStartTime(now.plusMinutes(15).toInstant())
            .sessionType(SessionType.PRACTICE)
            .durationType(DurationType.MINUTES)
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(1L)
                .longEventName("Long Event Name 1")
                .shortEventName("Event 1")
                .status(EventStatusType.ONGOING)
                .trackLayout(RacetrackLayout.builder()
                    .name("Layout 1")
                    .racetrack(Racetrack.builder()
                        .name("Track 1")
                        .build())
                    .build())
                .event(Event.builder()
                    .name("Event 1")
                    .raid(false)
                    .rally(false)
                    .build())
                .seriesEditions(Collections.emptySet())
                .build())
            .build());

        eventSessions.put(2L, EventSession.builder()
            .id(2L)
            .duration(20f)
            .name("Practice 1")
            .shortname("P1")
            .sessionStartTime(now.plusMinutes(15).toInstant())
            .sessionType(SessionType.PRACTICE)
            .durationType(DurationType.MINUTES)
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(2L)
                .longEventName("Long Event Name 2")
                .shortEventName("Event 2")
                .status(EventStatusType.ONGOING)
                .trackLayout(RacetrackLayout.builder()
                    .name("Layout 1")
                    .racetrack(Racetrack.builder()
                        .name("Track 1")
                        .build())
                    .build())
                .event(Event.builder()
                    .name("Event 1")
                    .raid(false)
                    .rally(false)
                    .build())
                .seriesEditions(Collections.emptySet())
                .build())
            .build());

        eventSessions.put(3L, EventSession.builder()
            .id(3L)
            .duration(20f)
            .name("Practice 2")
            .shortname("P2")
            .sessionStartTime(now.plusHours(1).toInstant())
            .sessionType(SessionType.PRACTICE)
            .durationType(DurationType.MINUTES)
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(2L)
                .longEventName("Long Event Name 2")
                .shortEventName("Event 2")
                .status(EventStatusType.ONGOING)
                .trackLayout(RacetrackLayout.builder()
                    .name("Layout 1")
                    .racetrack(Racetrack.builder()
                        .name("Track 1")
                        .build())
                    .build())
                .event(Event.builder()
                    .name("Event 1")
                    .raid(false)
                    .rally(false)
                    .build())
                .seriesEditions(Collections.emptySet())
                .build())
            .build());

        eventSessions.put(4L, EventSession.builder()
            .id(4L)
            .duration(20f)
            .name("Race")
            .shortname("R")
            .sessionType(SessionType.PRACTICE)
            .durationType(DurationType.MINUTES)
            .sessionStartTime(now.plusHours(3).toInstant())
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(1L)
                .longEventName("Long Event Name 1")
                .shortEventName("Event 1")
                .status(EventStatusType.ONGOING)
                .trackLayout(RacetrackLayout.builder()
                    .name("Layout 1")
                    .racetrack(Racetrack.builder()
                        .name("Track 1")
                        .build())
                    .build())
                .event(Event.builder()
                    .name("Event 1")
                    .raid(false)
                    .rally(false)
                    .build())
                .seriesEditions(Collections.emptySet())
                .build())
            .build());

        eventSessions.put(5L, EventSession.builder()
            .id(5L)
            .duration(20f)
            .name("Race")
            .shortname("R")
            .sessionType(SessionType.RACE)
            .durationType(DurationType.MINUTES)
            .sessionStartTime(now.plusHours(3).toInstant())
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(3L)
                .longEventName("Long Event Name 3")
                .shortEventName("Event 3")
                .status(EventStatusType.ONGOING)
                .trackLayout(RacetrackLayout.builder()
                    .name("Layout 1")
                    .racetrack(Racetrack.builder()
                        .name("Track 1")
                        .build())
                    .build())
                .event(Event.builder()
                    .name("Event 1")
                    .raid(false)
                    .rally(false)
                    .build())
                .seriesEditions(Set.of(SeriesEdition.builder()
                        .id(230L)
                        .editionName("Series Edition 1")
                        .series(series)
                    .build()))
                .build())
            .build());

        sessions15min.addSession(eventSessions.get(1L));
        sessions15min.addSession(eventSessions.get(2L));
        sessions1hour.addSession(eventSessions.get(3L));
        sessions3hour.addSession(eventSessions.get(4L));
        sessions3hour.addSession(eventSessions.get(5L));
    }

    @Test
    public void testTelegramInvocations() {
        when(sessionsRepository.findById(epochSecs15m)).thenReturn(Optional.of(sessions15min));
        when(sessionsRepository.findById(epochSecs1h)).thenReturn(Optional.of(sessions1hour));
        when(sessionsRepository.findById(epochSecs3h)).thenReturn(Optional.of(sessions3hour));

        when(eventSessionRepository.findAllById(anyCollection())).thenReturn(eventSessions.values().stream().toList());

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        try (MockedStatic<OffsetDateTime> mockedLocalDateTime = mockStatic(OffsetDateTime.class)) {
            mockedLocalDateTime.when(() -> OffsetDateTime.now(ZoneOffset.UTC)).thenReturn(now);
            mockedLocalDateTime.when(() -> OffsetDateTime.of(
                anyInt(), anyInt(), anyInt(), anyInt(),
                anyInt(), anyInt(), anyInt(), any(ZoneOffset.class))).thenCallRealMethod();

            subscriptionsService.generateNotifications();
        }

        verify(telegramBot, times(5)).execute(any(SendMessage.class));
    }

    @Test
    public void testUserNotifications() {
        when(sessionsRepository.findById(epochSecs15m)).thenReturn(Optional.of(sessions15min));
        when(sessionsRepository.findById(epochSecs1h)).thenReturn(Optional.of(sessions1hour));
        when(sessionsRepository.findById(epochSecs3h)).thenReturn(Optional.of(sessions3hour));

        when(eventSessionRepository.findAllById(anyCollection())).thenReturn(eventSessions.values().stream().toList());

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        UserSubscription userSubscription = new UserSubscription();
        userSubscription.setUser(User.builder()
                .email("xyz@domain.com")
            .build());
        userSubscription.setFifteenMinWarning(true);
        userSubscription.setThreeHoursWarning(true);
        userSubscription.setRaces(true);
        userSubscription.setSeries(series);
        List<UserSubscription> userSubscriptions = Arrays.asList(userSubscription);
        when(userSubscriptionRepository.findAllBySeriesIn(anyList())).thenReturn(userSubscriptions);

        try (MockedStatic<OffsetDateTime> mockedLocalDateTime = mockStatic(OffsetDateTime.class)) {
            mockedLocalDateTime.when(() -> OffsetDateTime.now(ZoneOffset.UTC)).thenReturn(now);
            mockedLocalDateTime.when(() -> OffsetDateTime.of(
                anyInt(), anyInt(), anyInt(), anyInt(),
                anyInt(), anyInt(), anyInt(), any(ZoneOffset.class))).thenCallRealMethod();

            subscriptionsService.generateNotifications();
        }

        verify(messagingService, times(1)).sendSessionNotification(any(User.class), any(EventSession.class));
    }
}

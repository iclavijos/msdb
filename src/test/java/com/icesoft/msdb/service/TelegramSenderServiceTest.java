package com.icesoft.msdb.service;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.configuration.TestSecurityConfiguration;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSettings;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscription;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscriptionKey;
import com.icesoft.msdb.repository.mongo.subscriptions.TelegramGroupSettingsRepository;
import com.icesoft.msdb.repository.mongo.subscriptions.TelegramGroupSubscriptionRepository;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = { MotorsportsDatabaseApp.class })
@ContextConfiguration(classes = TestSecurityConfiguration.class)
@ExtendWith(SpringExtension.class)
public class TelegramSenderServiceTest {

    private OffsetDateTime now = OffsetDateTime.of(2022, 9, 10, 0, 0, 0, 0, ZoneOffset.UTC);

    @Autowired
    private TelegramSenderService telegramSenderService;
    @MockBean
    private TelegramBot telegramBot;
    @MockBean
    private SendResponse telegramSendResponse;
    @MockBean
    private TelegramGroupSubscriptionRepository telegramGroupSubscriptionRepository;
    @MockBean
    private TelegramGroupSettingsRepository telegramGroupSettingsRepository;

    private EventSession getRacetrackSession() {
        EventSession racetrackSession = EventSession.builder()
            .id(1L)
            .duration(20f)
            .name("Session 1")
            .shortname("S1")
            .sessionStartTime(now.plusMinutes(15).toInstant())
            .sessionType(SessionType.QUALIFYING)
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
                .seriesEditions(Stream.of(
                        SeriesEdition.builder()
                            .id(1L)
                            .logoUrl("http://something.com/image.png")
                            .series(Series.builder().id(1L).build())
                            .build())
                    .collect(Collectors.toSet()))
                .build())
            .build();
        return racetrackSession;
    }

    private EventSession getRallySession() {
        return EventSession.builder()
            .id(2L)
            .duration(20.3f)
            .name("Village A 1")
            .shortname("SS1")
            .sessionStartTime(now.plusMinutes(15).toInstant())
            .sessionType(SessionType.STAGE)
            .durationType(DurationType.KMS)
            .cancelled(false)
            .eventEdition(EventEdition.builder()
                .id(2L)
                .longEventName("Rally Event")
                .shortEventName("Rally 1")
                .status(EventStatusType.ONGOING)
                .event(Event.builder()
                    .name("Event 2")
                    .raid(false)
                    .rally(true)
                    .build())
                .seriesEditions(Collections.emptySet())
                .build())
            .build();
    }

    @Test
    public void sentRacetrackMessageIsAsExpected() {
        EventSession racetrackSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 1L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build(),
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 2L))
                .notifyRaces(true)
                .notifyQualifying(false)
                .notifyPractice(false)
                .build()
        ));
        when(telegramGroupSettingsRepository.findAll()).thenReturn(Arrays.asList(
            TelegramGroupSettings.builder()
                .id(1L)
                .languageCode("CA")
                .build()
        ));

        telegramSenderService.notifySession(racetrackSession, 15);

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot, times(2)).execute(argument.capture());
        List<SendMessage> values = argument.getAllValues();
        assertNotNull(values);
        assertFalse(values.isEmpty());
        List<String> messageValues = values.parallelStream().map(value -> (String)value.getParameters().get("text")).collect(Collectors.toList());
        assertTrue(
            Arrays.asList(
                "<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                "La sesión <b>Session 1</b> perteneciente a <b>Long Event Name 1</b> empieza en 15 minutos en <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                "La sessió <b>Session 1</b> que pertany a <b>Long Event Name 1</b> comença en 15 minuts a <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n")
                .containsAll(messageValues));

    }

    @Test
    public void sentRallyMessageIsAsExpected() {
        EventSession rallySession = getRallySession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        telegramSenderService.notifySession(rallySession, 15);

        verify(telegramBot, times(1)).execute(any(SendMessage.class));

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot).execute(argument.capture());
        String message = (String)argument.getValue().getParameters().get("text");

        assertNotNull(message);
        assertEquals("<b>SS1 - Village A 1 (20.3 km)</b> stage belonging to <b>Rally Event</b> will start in 15 minutes\n", message);

    }

    @Test
    public void testWhenNoGroupSettings() {
        EventSession racetrackSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 4059079L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build()
        ));

        telegramSenderService.notifySession(racetrackSession, 15);

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot, times(2)).execute(argument.capture());
        List<SendMessage> values = argument.getAllValues();
        assertNotNull(values);
        assertFalse(values.isEmpty());
        List<String> messageValues = values.parallelStream().map(value -> (String)value.getParameters().get("text")).collect(Collectors.toList());
        assertTrue(
            Arrays.asList(
                    "<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n")
                .containsAll(messageValues));
    }

    @Test
    public void testTwoGroupsWithSameLanguage() {
        EventSession racetrackSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 4059079L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build(),
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 12345L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build(),
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 3234L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build(),
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 666L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build(),
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 987L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build()
        ));
        when(telegramGroupSettingsRepository.findAll()).thenReturn(Arrays.asList(
            TelegramGroupSettings.builder()
                .id(4059079L)
                .languageCode("ES")
                .build(),
            TelegramGroupSettings.builder()
                .id(12345L)
                .languageCode("CA")
                .build(),
            TelegramGroupSettings.builder()
                .id(3234L)
                .languageCode("ES")
                .build(),
            TelegramGroupSettings.builder()
                .id(666L)
                .languageCode("EN")
                .build(),
            TelegramGroupSettings.builder()
                .id(987L)
                .languageCode("EN")
                .build()
        ));

        telegramSenderService.notifySession(racetrackSession, 15);

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot, times(6)).execute(argument.capture());
        List<SendMessage> values = argument.getAllValues();
        assertNotNull(values);
        assertFalse(values.isEmpty());
        List<String> messageValues = values.parallelStream().map(value -> (String)value.getParameters().get("text")).collect(Collectors.toList());
        assertTrue(
            Arrays.asList(
                    "<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sesión <b>Session 1</b> perteneciente a <b>Long Event Name 1</b> empieza en 15 minutos en <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sessió <b>Session 1</b> que pertany a <b>Long Event Name 1</b> comença en 15 minuts a <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n")
                .containsAll(messageValues.subList(0, 5)));
    }

    @Test
    public void testUnsubscribeGroupAfterBotKicked() {
        EventSession eventSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(false);
        when(telegramSendResponse.errorCode()).thenReturn(403);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 1L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build()
        ));
        when(telegramGroupSettingsRepository.findAll()).thenReturn(Arrays.asList(
            TelegramGroupSettings.builder()
                .id(1L)
                .languageCode("ES")
                .build()
        ));

        telegramSenderService.notifySession(eventSession, 15);

        verify(telegramGroupSubscriptionRepository, times(1)).deleteByIdChatId(anyLong());
        verify(telegramGroupSettingsRepository, times(1)).deleteById(anyLong());
    }

    @Test
    public void testMessageSentWhenNoNotificationsSetting() {
        EventSession racetrackSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 1L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build()
        ));
        when(telegramGroupSettingsRepository.findAll()).thenReturn(Arrays.asList(
            TelegramGroupSettings.builder()
                .id(1L)
                .languageCode("CA")
                .build()
        ));

        telegramSenderService.notifySession(racetrackSession, 15);

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot, times(2)).execute(argument.capture());
        List<SendMessage> values = argument.getAllValues();
        assertNotNull(values);
        assertFalse(values.isEmpty());
        List<String> messageValues = values.parallelStream().map(value -> (String)value.getParameters().get("text")).collect(Collectors.toList());
        assertTrue(
            Arrays.asList(
                    "<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sesión <b>Session 1</b> perteneciente a <b>Long Event Name 1</b> empieza en 15 minutos en <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sessió <b>Session 1</b> que pertany a <b>Long Event Name 1</b> comença en 15 minuts a <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n")
                .containsAll(messageValues));

    }

    @Test
    public void testNoMessageSentWhenNotificationsSettingDoNotMatch() {
        EventSession racetrackSession = getRacetrackSession();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        when(telegramGroupSubscriptionRepository.findAllByIdSeriesId(anyList())).thenReturn(Arrays.asList(
            TelegramGroupSubscription.builder()
                .id(new TelegramGroupSubscriptionKey(1L, 1L))
                .notifyRaces(true)
                .notifyQualifying(true)
                .notifyPractice(false)
                .build()
        ));
        when(telegramGroupSettingsRepository.findAll()).thenReturn(Arrays.asList(
            TelegramGroupSettings.builder()
                .id(1L)
                .languageCode("CA")
                .minutesNotification(Arrays.asList(60))
                .build()
        ));

        telegramSenderService.notifySession(racetrackSession, 15);

        ArgumentCaptor<SendMessage> argument = ArgumentCaptor.forClass(SendMessage.class);
        verify(telegramBot, times(1)).execute(argument.capture());
        List<SendMessage> values = argument.getAllValues();
        assertNotNull(values);
        assertFalse(values.isEmpty());
        List<String> messageValues = values.parallelStream().map(value -> (String)value.getParameters().get("text")).collect(Collectors.toList());
        assertTrue(
            Arrays.asList(
                    "<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sesión <b>Session 1</b> perteneciente a <b>Long Event Name 1</b> empieza en 15 minutos en <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n",
                    "La sessió <b>Session 1</b> que pertany a <b>Long Event Name 1</b> comença en 15 minuts a <b>Track 1</b>\n<a href=\"http://something.com/image.jpg\">&#8205;</a>\n")
                .containsAll(messageValues));

    }
}

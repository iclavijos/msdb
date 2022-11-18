package com.icesoft.msdb.service;

import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.configuration.TestSecurityConfiguration;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.domain.enums.SessionType;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

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

    @Test
    public void sentRacetrackMessageIsAsExpected() {
        EventSession racetrackSession = EventSession.builder()
            .id(1L)
            .duration(20f)
            .name("Session 1")
            .shortname("S1")
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
            .build();

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        telegramSenderService.sendMessage(racetrackSession, 15);

        verify(telegramBot).execute(argThat((SendMessage message) -> {
            String text = (String)message.getParameters().get("text");
            Assert.assertNotNull(text);

            return text.equals("<b>Session 1</b> session belonging to <b>Long Event Name 1</b> will start in 15 minutes at <b>Track 1</b>");
        }));
    }

    @Test
    public void sentRallyMessageIsAsExpected() {
        EventSession rallySession = EventSession.builder()
            .id(2L)
            .duration(20f)
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

        when(telegramSendResponse.isOk()).thenReturn(true);
        when(telegramBot.execute(any(SendMessage.class))).thenReturn(telegramSendResponse);

        telegramSenderService.sendMessage(rallySession, 15);

        verify(telegramBot).execute(argThat((SendMessage message) -> {
            String text = (String)message.getParameters().get("text");
            Assert.assertNotNull(text);

            return text.equals("<b>SS1 - Village A 1</b> stage belonging to <b>Rally Event</b> will start in 15 minutes");
        }));
    }

}

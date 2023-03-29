package com.icesoft.msdb.service;

import com.google.api.services.calendar.Calendar;
import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.configuration.TestSecurityConfiguration;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.CalendarSessionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.util.List;

import static org.mockito.Mockito.*;

@SpringBootTest(classes = { MotorsportsDatabaseApp.class })
@ContextConfiguration(classes = TestSecurityConfiguration.class)
@ExtendWith(SpringExtension.class)
public class GoogleCalendarServiceTest {

    @Autowired
    private GoogleCalendarService calendarService;
    @MockBean
    private CalendarSessionRepository calendarSessionRepository;
    @MockBean
    private Calendar calendar;
    @MockBean
    private Calendar.Events events;
    @MockBean
    private Calendar.Events.Delete eventsDelete;

    private SeriesEdition getSeriesEdition() {
        return SeriesEdition.builder()
            .id(1L)
            .editionName("Series Edition 1")
            .calendarId("calId1")
            .build();
    }

    private EventEdition getEventEdition() {
        return EventEdition.builder()
            .id(1L)
            .build();
    }

    private List<EventSession> getEventSessions() {
        return List.of(
            EventSession.builder()
                .id(1L)
                .build(),
            EventSession.builder()
                .id(2L)
                .build()
        );
    }

    @Test
    public void testRemoveEventNotPreviouslyRegistered() {

        when(calendarSessionRepository.findBySeriesEditionIdEventSessionId(anyLong(), anyLong())).thenReturn(List.of());

        calendarService.removeEvent(getSeriesEdition(), getEventEdition(), getEventSessions());

        verify(calendar, times(0)).events();

    }

    @Test
    public void testRemoveEventPreviouslyRegistered() throws IOException {

        CalendarSession calendarSession = new CalendarSession(getSeriesEdition(), getEventSessions().get(0));
        calendarSession.setCalendarId("abc123");

        when(calendar.events()).thenReturn(events);
        when(events.delete(anyString(), anyString())).thenReturn(eventsDelete);

        when(calendarSessionRepository.findBySeriesEditionIdEventSessionId(anyLong(), anyLong())).thenReturn(List.of(calendarSession));

        calendarService.removeEvent(getSeriesEdition(), getEventEdition(), getEventSessions());

        verify(calendar, times(2)).events();

    }
}

package com.icesoft.msdb.service;

import com.google.api.services.calendar.Calendar;
import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.configuration.TestSecurityConfiguration;
import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.repository.jpa.CalendarSessionRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.io.IOException;
import java.util.List;

import static org.mockito.Mockito.*;

@Testcontainers
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

    static ElasticsearchContainer elasticContainer = new ElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch:8.3.3")
        .withReuse(true)
        .withExposedPorts(9200)
        .withEnv("discovery.type", "single-node")
        .withEnv("xpack.security.enabled", "false")
        .waitingFor(Wait.forListeningPort());

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.elasticsearch.uris", elasticContainer::getHttpHostAddress);
    }

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

    @BeforeAll
    public static void beforeAll() {
        elasticContainer.start();
    }

    @AfterAll
    public static void afterAll() {
        elasticContainer.stop();
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

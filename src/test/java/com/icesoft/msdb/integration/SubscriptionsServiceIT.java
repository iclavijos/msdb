package com.icesoft.msdb.integration;

import co.elastic.clients.elasticsearch.ElasticsearchAsyncClient;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.icesoft.msdb.MotorsportsDatabaseApp;
import com.icesoft.msdb.configuration.TestSecurityConfiguration;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.subscriptions.Sessions;
import com.icesoft.msdb.repository.mongo.subscriptions.SessionsRepository;
import com.icesoft.msdb.service.SubscriptionsService;
import org.elasticsearch.client.RestClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Testcontainers
@SpringBootTest(classes = MotorsportsDatabaseApp.class)
@ContextConfiguration(classes = TestSecurityConfiguration.class)
class SubscriptionsServiceIT {

    private static ElasticsearchClient elasticClient;
    private static RestClient restClient;
    private static ElasticsearchAsyncClient elasticAsyncClient;

    private OffsetDateTime now = OffsetDateTime.of(2022, 9, 10, 0, 0, 0, 0, ZoneOffset.UTC);

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.4.2").withReuse(true);

    @Container
    static ElasticsearchContainer elasticContainer = new ElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch:8.3.3")
        .withReuse(true)
        .withExposedPorts(9200)
        .withEnv("discovery.type", "single-node")
        .withEnv("xpack.security.enabled", "false");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.elasticsearch.uris", elasticContainer::getHttpHostAddress);
    }

    @Autowired
    private SubscriptionsService subscriptionsService;

    @Autowired
    private SessionsRepository sessionsRepository;

    @BeforeEach
    void testIsContainerRunning() {
        Assertions.assertTrue(elasticContainer.isRunning());
        // resetIndex();
    }

    @AfterEach
    void cleanUp() {
        this.sessionsRepository.deleteAll();
    }

    @Test
    void shouldFindOneAfterCreation() {
        EventSession eventSession = EventSession.builder()
            .id(1L)
            .sessionStartTime(now.toInstant())
            .name("Session 1")
            .build();

        this.subscriptionsService.saveEventSession(eventSession);

        Optional<Sessions> sessions = sessionsRepository.findById(now.toEpochSecond());

        assertTrue(sessions.isPresent());
        assertTrue(sessions.get().getSessions().size() == 1);

    }

    @Test
    void shouldNotFindAnyAfterUpdate() {
        EventSession eventSession = EventSession.builder()
            .id(1L)
            .sessionStartTime(now.toInstant())
            .name("Session 1")
            .build();

        subscriptionsService.saveEventSession(eventSession);

        eventSession.setSessionStartTime(now.plusMinutes(10).toInstant());
        subscriptionsService.saveEventSession(eventSession, now.toEpochSecond());

        Optional<Sessions> sessions = sessionsRepository.findById(now.toEpochSecond());

        assertTrue(sessions.isEmpty());
    }

    @Test
    void shouldNotFindAnyAfterDelete() {
        EventSession eventSession = EventSession.builder()
            .id(1L)
            .sessionStartTime(now.toInstant())
            .name("Session 1")
            .build();

        subscriptionsService.saveEventSession(eventSession);

        subscriptionsService.deleteEventSession(eventSession);

        Optional<Sessions> sessions = sessionsRepository.findById(now.toEpochSecond());

        assertTrue(sessions.isEmpty());
    }

    @Test
    void shouldFindTwoSessionsAtSameTime() {
        EventSession eventSession1 = EventSession.builder()
            .id(1L)
            .sessionStartTime(now.toInstant())
            .name("Session 1")
            .build();

        EventSession eventSession2 = EventSession.builder()
            .id(2L)
            .sessionStartTime(now.toInstant())
            .name("Session 2")
            .build();

        subscriptionsService.saveEventSession(eventSession1);
        subscriptionsService.saveEventSession(eventSession2);

        Optional<Sessions> sessions = sessionsRepository.findById(now.toEpochSecond());

        assertTrue(sessions.isPresent());
        assertTrue(sessions.get().getSessions().size() == 2);
    }

    @Test
    void shouldFindTwoSessionsInDifferentTimes() {
        EventSession eventSession1 = EventSession.builder()
            .id(1L)
            .sessionStartTime(now.toInstant())
            .name("Session 1")
            .build();

        EventSession eventSession2 = EventSession.builder()
            .id(2L)
            .sessionStartTime(now.toInstant())
            .name("Session 2")
            .build();

        EventSession eventSession3 = EventSession.builder()
            .id(3L)
            .sessionStartTime(now.toInstant())
            .name("Session 3")
            .build();

        subscriptionsService.saveEventSession(eventSession1);
        subscriptionsService.saveEventSession(eventSession2);
        subscriptionsService.saveEventSession(eventSession3);

        eventSession2.setSessionStartTime(now.plusMinutes(15).toInstant());

        subscriptionsService.saveEventSession(eventSession2, now.toEpochSecond());

        Optional<Sessions> sessions = sessionsRepository.findById(now.toEpochSecond());

        assertTrue(sessions.isPresent());
        assertTrue(sessions.get().getSessions().size() == 2);

        sessions = sessionsRepository.findById(now.plusMinutes(15).toEpochSecond());

        assertTrue(sessions.isPresent());
        assertTrue(sessions.get().getSessions().size() == 1);
    }
}

package com.icesoft.msdb.repository.mongo;

import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscription;
import com.icesoft.msdb.domain.subscriptions.TelegramGroupSubscriptionKey;
import com.icesoft.msdb.repository.mongo.subscriptions.TelegramGroupSubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.test.context.ContextConfiguration;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ContextConfiguration(classes = TelegramGroupSubscriptionRepositoryTest.TestConfig.class)
public class TelegramGroupSubscriptionRepositoryTest {

    @Autowired
    private TelegramGroupSubscriptionRepository repository;

    @BeforeEach
    public void loadData() {
        repository.save(TelegramGroupSubscription.builder()
            .id(new TelegramGroupSubscriptionKey(100L, 200L))
                .seriesName("Series 1")
                .notifyRaces(true)
                .notifyQualifying(true)
            .build());
        repository.save(TelegramGroupSubscription.builder()
            .id(new TelegramGroupSubscriptionKey(100L, 300L))
            .seriesName("Series 1")
            .notifyRaces(true)
            .notifyQualifying(false)
            .build());
        repository.save(TelegramGroupSubscription.builder()
            .id(new TelegramGroupSubscriptionKey(110L, 200L))
            .seriesName("Series 2")
            .notifyRaces(true)
            .notifyQualifying(true)
                .notifyPractice(true)
            .build());
    }

    @Test
    public void contextLoads() {
        assertThat(repository).isNotNull();
    }

    @Test
    public void testRealMongo() {
        List<TelegramGroupSubscription> subs = repository.findAllByIdSeriesId(Arrays.asList(100L));
        assertEquals(2, subs.size());
    }

    @Configuration
    @EnableMongoRepositories(basePackageClasses = TelegramGroupSubscriptionRepository.class)
    @EntityScan(basePackages = "com.icesoft.msdb.domain")
    static class TestConfig {

    }
}

package com.icesoft.msdb.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.icesoft.msdb.domain.*;
import com.icesoft.msdb.domain.enums.EventStatusType;
import com.icesoft.msdb.repository.jpa.EventEditionRepository;
import com.icesoft.msdb.repository.jpa.EventRepository;
import com.icesoft.msdb.repository.jpa.SeriesEditionRepository;
import com.icesoft.msdb.repository.jpa.SeriesRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ContextConfiguration;

import java.time.LocalDate;
import java.util.*;

@DataJpaTest
@ContextConfiguration(classes = SeriesEditionRepositoryTest.TestConfig.class)
public class SeriesEditionRepositoryTest {

    @Autowired
    private SeriesRepository seriesRepository;
    @Autowired
    private SeriesEditionRepository repository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private EventEditionRepository eventEditionRepository;

    @Test
    public void contextLoads() {
        assertThat(repository).isNotNull();
    }

    private void loadData() {
        Series series = Series.builder()
            .id(1L)
            .name("Series 1")
            .shortname("S1")
            .build();
        series.setCreatedBy("Test");
        series = seriesRepository.save(series);

        SeriesEdition seriesEdition = SeriesEdition.builder()
            .id(1L)
            .editionName("Series Edition 1")
            .period("2022")
            .numEvents(3)
            .series(series)
            .build();
        seriesEdition.setCreatedBy("Test");
        seriesEdition = repository.save(seriesEdition);

        Event racetrackEvent = Event.builder()
            .name("Event 1")
            .raid(false)
            .rally(false)
            .build();
        racetrackEvent.setCreatedBy("Test");
        racetrackEvent = eventRepository.save(racetrackEvent);

        EventEdition racetrackEventEdition = EventEdition.builder()
            .id(1L)
            .longEventName("Track Event")
            .shortEventName("Event 1")
            .eventDate(LocalDate.now())
            .editionYear(2022)
            .status(EventStatusType.ONGOING)
            .trackLayout(RacetrackLayout.builder()
                .name("Layout 1")
                .racetrack(Racetrack.builder()
                    .name("Track 1")
                    .build())
                .build())
            .event(racetrackEvent)
            .seriesEditions(Collections.emptySet())
            // .seriesEditions(Set.of(seriesEdition))
            .build();
        racetrackEventEdition.setCreatedBy("Test");

        Event rallyEvent = Event.builder()
            .name("Rally Event")
            .raid(false)
            .rally(true)
            .build();
        rallyEvent.setCreatedBy("Test");
        rallyEvent = eventRepository.save(rallyEvent);

        EventEdition rallyEventEdition = EventEdition.builder()
            .id(2L)
            .longEventName("Rally Event 1")
            .shortEventName("Event 2")
            .eventDate(LocalDate.now())
            .editionYear(2022)
            .status(EventStatusType.ONGOING)
            .event(rallyEvent)
            .seriesEditions(Collections.emptySet()) // Set.of(seriesEdition))
            .build();
        rallyEventEdition.setCreatedBy("Test");
        rallyEventEdition = eventEditionRepository.save(rallyEventEdition);

        // seriesEdition.addEvent(racetrackEventEdition);
        seriesEdition.addEvent(rallyEventEdition);
        repository.save(seriesEdition);
    }

    @Test
    public void repositoryShouldBeEmpty() {
        List<SeriesEdition> series = repository.findAll();

        assertThat(series).isEmpty();
    }

    @Test
    public void repositoryShouldHaveOneSeriesEdition() {
        loadData();
        List<SeriesEdition> series = repository.findAll();

        assertThat(series).hasSize(1);
    }

    @Test
    public void seriesEditionShouldHaveOneEvent() {
        loadData();
        Optional<SeriesEdition> optSeriesEdition = repository.findById(1L);

        assertThat(optSeriesEdition).isNotEmpty();
        assertThat(optSeriesEdition.get().getEvents()).hasSize(1);
    }

    @Configuration
    @EnableJpaRepositories(basePackageClasses = SeriesEditionRepository.class)
    @EntityScan(basePackages = "com.icesoft.msdb.domain")
    static class TestConfig {

    }
}

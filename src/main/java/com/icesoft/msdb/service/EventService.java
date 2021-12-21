package com.icesoft.msdb.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.icesoft.msdb.domain.SeriesEdition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.service.dto.EditionIdYearDTO;

/**
 * Service Interface for managing Event.
 */
public interface EventService {

    /**
     * Save an Event.
     *
     * @param event the entity to save
     * @return the persisted entity
     */
    Event save(Event event);

    /**
     * Save an Event Edition.
     *
     * @param eventEdition the entity to save
     * @return the persisted entity
     */
    EventEdition save(EventEdition eventEdition);

    EventEdition save(EventEdition eventEdition, boolean update);

    /**
     *  Get all the events.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Event> findAll(Optional<String> query, Pageable pageable);

    /**
     *  Get the "id" event.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Event findOne(Long id);

    /**
     *  Delete the "id" event.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);

    Page<Event> search(String query, Pageable pageable);

    Page<EventEdition> findEventEditions(Long idEvent, Pageable pageable);

    List<EditionIdYearDTO> findEventEditionsIdYear(Long idEvent);

    EventEdition rescheduleEvent(EventEdition event, LocalDate newDate);

    EventEdition cloneEventEdition(Long eventEditionId, String newPeriod, Set<SeriesEdition> series);
}

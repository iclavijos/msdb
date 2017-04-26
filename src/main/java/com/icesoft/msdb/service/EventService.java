package com.icesoft.msdb.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.service.dto.EventEditionIdYearDTO;

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
    Event save(Event racetrack);

    /**
     *  Get all the events.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Event> findAll(Pageable pageable);

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
    
    List<EventEditionIdYearDTO> findEventEditionsIdYear(Long idEvent);
}

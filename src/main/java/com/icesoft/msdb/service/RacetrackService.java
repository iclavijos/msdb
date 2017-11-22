package com.icesoft.msdb.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;

/**
 * Service Interface for managing Racetrack.
 */
public interface RacetrackService {

    /**
     * Save a racetrack.
     *
     * @param racetrack the entity to save
     * @return the persisted entity
     */
    Racetrack save(Racetrack racetrack);
    
    RacetrackLayout save(RacetrackLayout layout);

    /**
     *  Get all the racetracks.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Racetrack> findAll(Pageable pageable);

    /**
     *  Get the "id" racetrack.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Racetrack find(Long id);
    
    RacetrackLayout findLayout(Long id);

    /**
     *  Delete the "id" racetrack.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);
    
    void deleteLayout(Long id);
    
    Page<Racetrack> search(String query, Pageable pageable);
    
    Page<RacetrackLayout> searchLayouts(String query, Pageable pageable);
    
    List<RacetrackLayout> findRacetrackLayouts(Long id);
}

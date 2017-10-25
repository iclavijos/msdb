package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Racetrack;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Racetrack entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RacetrackRepository extends JpaRepository<Racetrack,Long> {
    
}

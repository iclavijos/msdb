package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.RacetrackLayout;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the RacetrackLayout entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RacetrackLayoutRepository extends JpaRepository<RacetrackLayout,Long> {
    
}

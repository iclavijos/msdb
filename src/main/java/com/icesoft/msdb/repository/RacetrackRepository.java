package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Racetrack;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Racetrack entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RacetrackRepository extends JpaRepository<Racetrack, Long> {

}

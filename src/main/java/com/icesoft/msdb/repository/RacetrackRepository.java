package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Racetrack;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Racetrack entity.
 */
@SuppressWarnings("unused")
public interface RacetrackRepository extends JpaRepository<Racetrack,Long> {

}

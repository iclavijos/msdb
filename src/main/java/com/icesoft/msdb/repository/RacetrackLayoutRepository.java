package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.RacetrackLayout;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the RacetrackLayout entity.
 */
@SuppressWarnings("unused")
public interface RacetrackLayoutRepository extends JpaRepository<RacetrackLayout,Long> {
	List<RacetrackLayout> findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(long racetrackId);
}

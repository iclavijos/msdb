package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.RacetrackLayout;

/**
 * Spring Data JPA repository for the RacetrackLayout entity.
 */
public interface RacetrackLayoutRepository extends JpaRepository<RacetrackLayout,Long> {
	
	@Query("select r from RacetrackLayout r where "
			+ "lower(r.name) like lower(concat('%', ?1,'%')) or "
			+ "lower(r.racetrack.name) like lower(concat('%', ?1,'%'))")
	Page<RacetrackLayout> search(String searchValue, Pageable pageable);
	
	List<RacetrackLayout> findByRacetrackIdOrderByActiveDescYearFirstUseDescNameAsc(long racetrackId);
}

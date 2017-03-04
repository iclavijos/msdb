package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Racetrack;

/**
 * Spring Data JPA repository for the Racetrack entity.
 */
public interface RacetrackRepository extends JpaRepository<Racetrack,Long> {

	@Query("select r from Racetrack r where "
			+ "lower(r.name) like lower(concat('%', ?1,'%')) or "
			+ "lower(r.location) like lower(concat('%', ?1,'%'))")
	Page<Racetrack> search(String searchValue, Pageable pageable);
}

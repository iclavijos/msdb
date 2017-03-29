package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.Racetrack;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Event entity.
 */
@SuppressWarnings("unused")
public interface EventRepository extends JpaRepository<Event,Long> {

	@Query("select e from Event e where "
			+ "lower(e.name) like lower(concat('%', ?1,'%')) or "
			+ "lower(e.description) like lower(concat('%', ?1,'%'))")
	Page<Event> search(String searchValue, Pageable pageable);
}

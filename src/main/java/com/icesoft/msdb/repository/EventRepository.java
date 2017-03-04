package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Event;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Event entity.
 */
public interface EventRepository extends JpaRepository<Event,Long> {

	@Query("select e from Event e where e.name like lower(concat('%', ?1,'%')) or e.description like lower(concat('%', ?1,'%'))")
	List<Event> search(String searchValue);
}

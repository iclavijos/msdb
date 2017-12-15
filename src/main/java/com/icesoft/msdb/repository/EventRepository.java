package com.icesoft.msdb.repository;

import java.util.stream.Stream;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Event;

/**
 * Spring Data JPA repository for the Event entity.
 */
@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
	
	Event findByName(String name);

	@EntityGraph(value="EventWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<Event> readAllByIdNotNull();
}

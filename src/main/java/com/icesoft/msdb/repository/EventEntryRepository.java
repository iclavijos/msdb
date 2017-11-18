package com.icesoft.msdb.repository;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.EventEditionEntry;

/**
 * Spring Data JPA repository for the EventEntry entity.
 */
@Repository
public interface EventEntryRepository extends JpaRepository<EventEditionEntry,Long> {
	
	@EntityGraph(value="EventEntryPartial", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<EventEditionEntry> streamAllByIdNotNull();

	List<EventEditionEntry> findByEventEditionIdAndRaceNumber(Long eventEditionId, String raceNumber);
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.eventEdition.id = ?1 ORDER BY cast(e.raceNumber as integer) ASC, e.entryName ASC")
	List<EventEditionEntry> findEventEditionEntries(Long eventEditionId);
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.id IN ?1 ORDER BY e.eventEdition.eventDate ASC")
	List<EventEditionEntry> findEntriesInList(List<Long> ids);
	
}

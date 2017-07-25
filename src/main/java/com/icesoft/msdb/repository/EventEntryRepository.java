package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEditionEntry;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the EventEntry entity.
 */
@Repository
public interface EventEntryRepository extends JpaRepository<EventEditionEntry,Long> {

	List<EventEditionEntry> findByEventEditionIdAndRaceNumber(Long eventEditionId, String raceNumber);
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.eventEdition.id = ?1 ORDER BY cast(e.raceNumber as integer) ASC, e.entryName ASC")
	List<EventEditionEntry> findEventEditionEntries(Long eventEditionId);
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.id IN ?1 ORDER BY e.eventEdition.eventDate ASC")
	List<EventEditionEntry> findEntriesInList(List<Long> ids);
	
}

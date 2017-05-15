package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEditionEntry;

import org.springframework.data.jpa.repository.*;

import java.util.List;

import javax.persistence.NamedNativeQuery;

/**
 * Spring Data JPA repository for the EventEntry entity.
 */
@SuppressWarnings("unused")
public interface EventEntryRepository extends JpaRepository<EventEditionEntry,Long> {

	List<EventEditionEntry> findByEventEditionIdAndRaceNumber(Long eventEditionId, String raceNumber);
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.eventEdition.id = ?1 ORDER BY e.entryName ASC, cast(e.raceNumber as integer) ASC")
	List<EventEditionEntry> findEventEditionEntries(Long eventEditionId);
}

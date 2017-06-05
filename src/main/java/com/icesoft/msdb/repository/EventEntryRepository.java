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
	
	@Query("SELECT e FROM EventEditionEntry e WHERE e.eventEdition.id = ?1 ORDER BY cast(e.raceNumber as integer) ASC, e.entryName ASC")
	List<EventEditionEntry> findEventEditionEntries(Long eventEditionId);
	
	@Query("SELECT r.entry "
			+ "FROM EventEntryResult r "
			+ "WHERE r.session.eventEdition.id = ?1 "
			+ "AND r.session.sessionType = 2 AND r.finalPosition = 1 "
			+ "ORDER BY r.session.sessionStartTime ASC")	
	List<EventEditionEntry> findEventEditionWinners(Long eventEditionId);
}

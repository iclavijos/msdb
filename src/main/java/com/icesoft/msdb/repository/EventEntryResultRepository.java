package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the EventEntryResult entity.
 */
@Repository
public interface EventEntryResultRepository extends JpaRepository<EventEntryResult,Long> {

	List<EventEntryResult> findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAscLapsCompletedDesc(Long idSession, Long idEventEdition);
	
	List<EventEntryResult> findByEntryId(Long idEntry);
	
	List<EventEntryResult> findByEntryIdAndSessionSessionType(Long idEntry, SessionType type);
	
	List<EventEntryResult> findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAscLapsCompletedDesc(Long idEventEdition, Long sessionId, Long categoryId);
	
	@Query("SELECT r FROM EventEntryResult r WHERE r.bestLapTime = (SELECT MIN(r2.bestLapTime) FROM EventEntryResult r2 WHERE r2.id = ?1 AND r2.session.sessionType = ?2)")
	List<EventEntryResult> findEntryFastestLapPerSessionType(Long entryId, SessionType sessionType);
}

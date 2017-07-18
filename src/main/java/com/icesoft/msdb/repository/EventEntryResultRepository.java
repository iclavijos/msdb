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

	List<EventEntryResult> findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAsc(Long idSession, Long idEventEdition);
	
	List<EventEntryResult> findByEntryId(Long idEntry);
	
	List<EventEntryResult> findByEntryIdAndSessionSessionType(Long idEntry, SessionType type);
	
	List<EventEntryResult> findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAsc(Long idEventEdition, Long sessionId, Long categoryId);
}

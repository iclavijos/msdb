package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntryResult;

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
}

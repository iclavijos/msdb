package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntryResult;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the EventEntryResult entity.
 */
@SuppressWarnings("unused")
public interface EventEntryResultRepository extends JpaRepository<EventEntryResult,Long> {

	List<EventEntryResult> findBySessionIdAndSessionEventEditionIdOrderByFinalPositionAsc(Long idSession, Long idEventEdition);
}

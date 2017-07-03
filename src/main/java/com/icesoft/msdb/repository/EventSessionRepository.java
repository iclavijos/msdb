package com.icesoft.msdb.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.EventSession;

/**
 * Spring Data JPA repository for the EventSession entity.
 */
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {

	List<EventSession> findByEventEditionIdOrderBySessionStartTimeAsc(Long eventEditionId);
	
	@Query("SELECT s FROM EventSession s WHERE s.eventEdition.id = ?1 AND s.sessionType != 0")
	List<EventSession> findNonFPSessions(Long eventEditionId);
	
	@Query("SELECT s FROM EventSession s WHERE s.sessionStartTime BETWEEN ?1 AND ?2 ORDER BY s.sessionStartTime ASC")
	List<EventSession> findUpcomingSessions(ZonedDateTime fromDate, ZonedDateTime toDate);
}

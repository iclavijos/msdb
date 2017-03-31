package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventSession;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the EventSession entity.
 */
@SuppressWarnings("unused")
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {

	List<EventSession> findByEventEditionIdOrderBySessionStartTimeAsc(Long eventEditionId);
}

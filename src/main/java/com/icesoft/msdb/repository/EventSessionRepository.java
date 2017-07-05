package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventSession;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EventSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {
    
}

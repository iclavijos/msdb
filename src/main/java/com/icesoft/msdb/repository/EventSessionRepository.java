package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.EventSession;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the EventSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventSessionRepository extends JpaRepository<EventSession, Long> {

}

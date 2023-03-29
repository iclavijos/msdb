package com.icesoft.msdb.repository.jpa;

import com.icesoft.msdb.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the Category entity.
 */
@Repository
public interface CalendarSessionRepository extends JpaRepository<CalendarSession, CalendarSessionPK> {

    List<CalendarSession> findByEventSessionId(Long eventSessionId);

    @Query("SELECT cs FROM CalendarSession cs WHERE cs.seriesEdition.id = ?1 AND cs.eventSession.id = ?2")
    List<CalendarSession> findBySeriesEditionIdEventSessionId(Long seriesEditionId, Long eventSessionId);
}

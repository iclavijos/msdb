package com.icesoft.msdb.repository.jpa;

import com.icesoft.msdb.domain.CalendarSession;
import com.icesoft.msdb.domain.CalendarSessionPK;
import com.icesoft.msdb.domain.PointsSystemSession;
import com.icesoft.msdb.domain.PointsSystemSessionPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the Category entity.
 */
@Repository
public interface CalendarSessionRepository extends JpaRepository<CalendarSession, CalendarSessionPK> {

    List<CalendarSession> findByEventSessionId(Long eventSessionId);
    List<CalendarSession> findBySeriesEditionIdEventSessionId(Long seriesEditionId, Long eventSessionId);
}

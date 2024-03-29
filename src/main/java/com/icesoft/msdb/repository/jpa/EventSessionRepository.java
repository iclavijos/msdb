package com.icesoft.msdb.repository.jpa;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;

import com.icesoft.msdb.domain.EventEdition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.domain.SeriesEdition;

/**
 * Spring Data  repository for the EventSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventSessionRepository extends JpaRepository<EventSession,Long> {

	List<EventSession> findByEventEditionIdOrderBySessionStartTimeAsc(Long eventEditionId);

	@Query("SELECT s FROM EventSession s WHERE s.eventEdition.id = ?1 AND s.sessionType != 'practice' ORDER BY s.sessionStartTime ASC")
	List<EventSession> findNonFPSessions(Long eventEditionId);

    @Query("SELECT s FROM EventSession s WHERE s.sessionStartTime >= ?1 ORDER BY s.sessionStartTime ASC")
    List<EventSession> findUpcomingSessions(Long fromDate);

	@Query("SELECT s FROM EventSession s WHERE s.sessionStartTime BETWEEN ?1 AND ?2 ORDER BY s.sessionStartTime ASC")
	List<EventSession> findUpcomingSessions(Instant fromDate, Instant toDate);

    @Query("SELECT es FROM EventSession es WHERE ?1 = es.eventEdition AND "
        + "es.sessionType = com.icesoft.msdb.domain.enums.SessionType.RACE "
        + "ORDER BY es.sessionStartTime")
    List<EventSession> findRacesInEvent(EventEdition eventEdition);

	@Query("SELECT es FROM EventSession es WHERE ?1 MEMBER OF es.eventEdition.seriesEditions AND "
			+ "(es.sessionType = com.icesoft.msdb.domain.enums.SessionType.RACE OR es.sessionType = com.icesoft.msdb.domain.enums.SessionType.QUALIFYING_RACE) "
			+ "ORDER BY es.sessionStartTime")
	List<EventSession> findRacesInSeries(SeriesEdition seriesEdition);

    @Query("FROM EventSession e WHERE " +
        "day(e.sessionStartTime) = ?1 AND " +
        "month(e.sessionStartTime) = ?2 AND " +
        "e.sessionStartTime < CURRENT_DATE AND " +
        "sessionType = com.icesoft.msdb.domain.enums.SessionType.RACE")
	List<EventSession> findRacesOnDay(Integer day, Integer month);
}

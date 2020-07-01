package com.icesoft.msdb.repository;

import java.util.List;

import com.icesoft.msdb.domain.EventSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;

/**
 * Spring Data  repository for the EventEntryResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEntryResultRepository extends JpaRepository<EventEntryResult,Long> {

	List<EventEntryResult> findBySessionIdOrderByFinalPositionAsc(Long idSession);

	List<EventEntryResult> findByEntryId(Long idEntry);

	List<EventEntryResult> findByEntryIdAndSessionSessionType(Long idEntry, SessionType type);

	List<EventEntryResult> findByEntryEventEditionIdAndSessionIdAndEntryCategoryIdOrderByFinalPositionAscLapsCompletedDesc(Long idEventEdition, Long sessionId, Long categoryId);

	@Query("SELECT r FROM EventEntryResult r WHERE r.bestLapTime = (SELECT MIN(r2.bestLapTime) FROM EventEntryResult r2 WHERE r2.entry.id = ?1 AND r2.session.sessionType = ?2)")
	List<EventEntryResult> findEntryFastestLapPerSessionType(Long entryId, SessionType sessionType);

	@Query(value="select sum(laps_completed) as laps from event_entry_result where entry_id = ?1", nativeQuery=true)
	Integer countLapsCompletedInEvent(Long entryId);

	@Query(value="SELECT r.entry FROM EventEntryResult r WHERE r.session.id = ?1")
	List<EventEditionEntry> findSessionEntries(Long sessionId);

	@Query("SELECT MIN(r.bestLapTime) FROM EventEntryResult r WHERE r.session.id = ?1")
	Long findSessionFastestTime(Long sessionId);

    @Query("SELECT MAX(r.lapsCompleted) FROM EventEntryResult r WHERE r.session.id = ?1")
    Integer findSessionMaxLapsCompleted(Long sessionId);

    void deleteBySession(EventSession eventSession);

}

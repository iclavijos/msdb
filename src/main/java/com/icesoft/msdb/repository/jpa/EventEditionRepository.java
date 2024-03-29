package com.icesoft.msdb.repository.jpa;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.EventEdition;

/**
 * Spring Data  repository for the EventEdition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEditionRepository extends JpaRepository<EventEdition, Long> {

	@EntityGraph(value="EventEditionWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<EventEdition> streamAllByIdNotNull();

	List<EventEdition> findAllByOrderByEventDateAsc();

	List<EventEdition> findBySeriesEditionsId(Long seriesEditionId);

	Page<EventEdition> findByEventId(Long eventId, Pageable page);

	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select max(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear < ?2)")
	List<Long> findPreviousEditionId(Long eventId, Integer editionYear);

	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select min(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear > ?2)")
	List<Long> findNextEditionId(Long editionId, Integer editionYear);

	@Query("select e.id, e.editionYear from EventEdition e where e.event.id = ?1")
	List<Object[]> findEventEditionsIdYear(Long editionId);

	@Query("select e from EventEdition e " +
        "where e.trackLayout.racetrack.id = ?1 and e.eventDate >= ?2 and e.eventDate <= ?3 " +
        "and e.status = com.icesoft.msdb.domain.enums.EventStatusType.ONGOING " +
        "order by e.eventDate ASC")
    List<EventEdition> findEventsAtRacetrack(Long racetrackId, LocalDate start, LocalDate end);

    @Query("select e from EventEdition e " +
        "where e.trackLayout.racetrack.id = ?1 and e.eventDate <= ?2 " +
        "order by e.eventDate DESC")
    Page<EventEdition> findPreviousEventsAtRacetrack(Long racetrackId, LocalDate start, Pageable page);

}

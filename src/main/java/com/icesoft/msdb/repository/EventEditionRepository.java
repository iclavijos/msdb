package com.icesoft.msdb.repository;

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
 * Spring Data JPA repository for the EventEdition entity.
 */
@Repository
public interface EventEditionRepository extends JpaRepository<EventEdition,Long> {

	@EntityGraph(value="EventEditionWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<EventEdition> streamAllByIdNotNull();
	
	List<EventEdition> findAllByOrderByEventDateAsc();
	
	Page<EventEdition> findByEventIdOrderByEditionYearDesc(Long eventId, Pageable page);
	
	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select max(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear < ?2)")
	List<Long> findPreviousEditionId(Long eventId, Integer editionYear);
	
	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select min(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear > ?2)")
	List<Long> findNextEditionId(Long editionId, Integer editionYear);
	
	@Query("select e.id, e.editionYear from EventEdition e where e.event.id = ?1 order by e.editionYear desc")
	List<Object[]> findEventEditionsIdYear(Long editionId);
	
}

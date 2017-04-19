package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.EventEdition;

/**
 * Spring Data JPA repository for the EventEdition entity.
 */
@SuppressWarnings("unused")
public interface EventEditionRepository extends JpaRepository<EventEdition,Long> {

	@Query("select e from EventEdition e where e.editionYear like lower(concat('%', ?1,'%')) or "
			+ "e.shortEventName like lower(concat('%', ?1,'%')) or "
			+ "e.longEventName like lower(concat('%', ?1,'%'))")
	Page<EventEdition> search(String searchValue, Pageable page);
	
	Page<EventEdition> findByEventIdOrderByEditionYearDesc(Long eventId, Pageable page);
	
	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select max(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear < ?2)")
	Long findPreviousEditionId(Long eventId, Integer editionYear);
	
	@Query("select e.id from EventEdition e where e.event.id = ?1 and e.editionYear = ("
			+ "select min(e.editionYear) from EventEdition e where e.event.id = ?1 and e.editionYear > ?2)")
	Long findNextEditionId(Long editionId, Integer editionYear);
}

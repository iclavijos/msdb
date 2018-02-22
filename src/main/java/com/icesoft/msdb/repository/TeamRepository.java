package com.icesoft.msdb.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.util.List;
import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Team;

/**
 * Spring Data JPA repository for the Team entity.
 */
@Repository
public interface TeamRepository extends JpaRepository<Team,Long> {
	
	List<Team> findByIdIn(List<Long> ids);
	
	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select t from Team t")
	@Transactional(readOnly=true)
	Stream<Team> streamAll();

    Page<Team> findByNameContainsIgnoreCaseOrderByNameAsc(String searchValue, Pageable pageable);
}

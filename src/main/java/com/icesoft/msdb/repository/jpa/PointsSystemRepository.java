package com.icesoft.msdb.repository.jpa;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.PointsSystem;

/**
 * Spring Data  repository for the PointsSystem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select ps from PointsSystem ps")
	@Transactional(readOnly=true)
	Stream<PointsSystem> streamAll();

	PointsSystem findByName(String name);

	Page<PointsSystem> findByOrderByNameAsc(Pageable pageable);

	Page<PointsSystem> findByNameContainsIgnoreCase(String query, Pageable pageable);
}

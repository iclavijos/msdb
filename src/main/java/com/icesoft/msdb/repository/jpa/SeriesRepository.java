package com.icesoft.msdb.repository.jpa;

import static org.hibernate.jpa.AvailableHints.HINT_FETCH_SIZE;

import java.util.stream.Stream;

import jakarta.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Series;

/**
 * Spring Data  repository for the Series entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesRepository extends JpaRepository<Series,Long> {

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "1"))
	@Query(value = "select s from Series s")
	@Transactional(readOnly=true)
	Stream<Series> streamAll();
}

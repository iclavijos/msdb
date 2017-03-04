package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Series;

/**
 * Spring Data JPA repository for the Series entity.
 */
public interface SeriesRepository extends JpaRepository<Series,Long> {

	@Query("select s from Series s where s.name like lower(concat('%', ?1,'%')) or s.shortname like lower(concat('%', ?1,'%')) or s.organizer like lower(concat('%', ?1,'%'))")
	Page<Series> search(String searchValue, Pageable page);
}

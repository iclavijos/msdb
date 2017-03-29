package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.SeriesEdition;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the SeriesEdition entity.
 */
@SuppressWarnings("unused")
public interface SeriesEditionRepository extends JpaRepository<SeriesEdition,Long> {

	@Query("select ed from SeriesEdition ed where ed.period like lower(concat('%', ?1,'%'))")
	Page<SeriesEdition> search(String period, Pageable pageable);
	
	@Query("select ed from SeriesEdition ed where ed.series.id=?1 and ed.period like lower(concat('%', ?2,'%'))")
	Page<SeriesEdition> search(Long id, String period, Pageable pageable);
	
	Page<SeriesEdition> findBySeriesIdOrderByPeriodDesc(Long seriesId, Pageable pageable);
}

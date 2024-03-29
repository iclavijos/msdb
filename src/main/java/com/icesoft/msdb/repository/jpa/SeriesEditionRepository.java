package com.icesoft.msdb.repository.jpa;

import com.icesoft.msdb.domain.SeriesEdition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.QueryHint;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

import static org.hibernate.jpa.AvailableHints.HINT_FETCH_SIZE;

/**
 * Spring Data  repository for the SeriesEdition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesEditionRepository extends JpaRepository<SeriesEdition,Long> {

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "1"))
	@Query(value = "select s from SeriesEdition s")
	@Transactional(readOnly=true)
	Stream<SeriesEdition> streamAll();

	SeriesEdition findByEditionName(String name);

	@Query("select ed from SeriesEdition ed where ed.period like lower(concat('%', ?1,'%'))")
	Page<SeriesEdition> search(String period, Pageable pageable);

	@Query("select ed from SeriesEdition ed where ed.series.id=?1 and ed.period like lower(concat('%', ?2,'%'))")
	Page<SeriesEdition> search(Long id, String period, Pageable pageable);

	Page<SeriesEdition> findBySeriesId(Long seriesId, Pageable pageable);

	List<SeriesEdition> findDistinctSeriesEditionByEventsEventDateAfter(LocalDate date);

    @Query("select e.id, e.period from SeriesEdition e where e.series.id = ?1")
	List<Object[]> findSeriesEditionsIdYear(Long seriesId);

}

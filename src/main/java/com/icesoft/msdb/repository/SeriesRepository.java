package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Series;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Series entity.
 */
@SuppressWarnings("unused")
public interface SeriesRepository extends JpaRepository<Series,Long> {

}

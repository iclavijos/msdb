package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.SeriesEdition;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the SeriesEdition entity.
 */
@SuppressWarnings("unused")
public interface SeriesEditionRepository extends JpaRepository<SeriesEdition,Long> {

}

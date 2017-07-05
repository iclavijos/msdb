package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.SeriesEdition;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SeriesEdition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesEditionRepository extends JpaRepository<SeriesEdition,Long> {
    
}

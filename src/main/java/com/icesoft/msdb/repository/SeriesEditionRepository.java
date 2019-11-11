package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.SeriesEdition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the SeriesEdition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesEditionRepository extends JpaRepository<SeriesEdition, Long> {

}

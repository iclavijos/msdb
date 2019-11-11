package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.Series;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Series entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {

}

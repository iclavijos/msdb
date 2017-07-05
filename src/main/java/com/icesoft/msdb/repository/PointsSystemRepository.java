package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.PointsSystem;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PointsSystem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {
    
}

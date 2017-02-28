package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.PointsSystem;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the PointsSystem entity.
 */
@SuppressWarnings("unused")
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {

}

package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.PointsSystem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the PointsSystem entity.
 */
@SuppressWarnings("unused")
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {
	
	Page<PointsSystem> findByOrderByNameAsc(Pageable pageable);

	Page<PointsSystem> findByNameContainsIgnoreCase(String query, Pageable pageable);
}

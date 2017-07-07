package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.PointsSystem;

/**
 * Spring Data JPA repository for the PointsSystem entity.
 */
@Repository
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {
	
	Page<PointsSystem> findByOrderByNameAsc(Pageable pageable);

	Page<PointsSystem> findByNameContainsIgnoreCase(String query, Pageable pageable);
}

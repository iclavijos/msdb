package com.icesoft.msdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.PointsSystemSession;
import com.icesoft.msdb.domain.PointsSystemSessionPK;

/**
 * Spring Data JPA repository for the Category entity.
 */
@Repository
public interface PointsSystemSessionRepository extends JpaRepository<PointsSystemSession, PointsSystemSessionPK> {
	
}

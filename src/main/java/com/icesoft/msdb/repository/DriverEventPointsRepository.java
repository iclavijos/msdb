package com.icesoft.msdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.DriverEventPoints;

public interface DriverEventPointsRepository extends JpaRepository<DriverEventPoints,Long> {

	@Modifying
	@Query("DELETE FROM DriverEventPoints dep WHERE dep.session.id = ?1")
	@Transactional
	void deleteSessionPoints(Long sessionId);
}

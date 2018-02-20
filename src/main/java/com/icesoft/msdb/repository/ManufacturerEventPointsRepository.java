package com.icesoft.msdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.ManufacturerEventPoints;

@Repository
public interface ManufacturerEventPointsRepository extends JpaRepository<ManufacturerEventPoints, Long> {

	@Modifying
	@Query("DELETE FROM ManufacturerEventPoints mep WHERE mep.session.id = ?1")
	@Transactional
	void deleteSessionPoints(Long sessionId);

}

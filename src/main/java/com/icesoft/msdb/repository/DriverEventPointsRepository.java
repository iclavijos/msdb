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
	
	@Query("SELECT SUM(dep.points) "
			+ "FROM DriverEventPoints dep, EventEdition ee, EventSession es "
			+ "WHERE ee.id = ?1 AND es.eventEdition = ee AND dep.session = es AND dep.driver.id = ?2")
	Float getDriverPointsInEvent(Long eventEditionId, Long driverId);
	
	@Query("SELECT COUNT(DISTINCT e) "
			+ "FROM EventEdition e, EventSession es, DriverEventPoints dep "
			+ "WHERE e.seriesEdition.id = ?1 AND es.eventEdition = e AND dep.session = es")
	Integer countPunctuatedEventsInSeries(Long seriesEditionId);
}

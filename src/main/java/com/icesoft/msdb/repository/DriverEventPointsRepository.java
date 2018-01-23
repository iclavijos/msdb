package com.icesoft.msdb.repository;

import java.util.List;

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
			+ "FROM DriverEventPoints dep, EventSession es "
			+ "WHERE es.id = ?1 AND dep.session = es AND dep.driver.id = ?2")
	Float getDriverPointsInSession(Long sessionId, Long driverId);
	
	@Query("SELECT dep.driver.id, dep.driver.name, dep.driver.surname, sum(points) as points, count(*) as num_points "
			+ "FROM DriverEventPoints dep "
			+ "WHERE dep.points <> 0 AND dep.session.eventEdition.id = ?1 "
			+ "GROUP BY dep.driver.id "
			+ "ORDER BY points desc")
	List<Object[]> getDriversPointsInEvent(Long eventEditionId);
	
	@Query("SELECT dep.id, dep.driver.name, dep.driver.surname, dep.points, dep.reason "
			+ "FROM DriverEventPoints dep "
			+ "WHERE dep.points <> 0 AND dep.session.eventEdition.id = ?1 AND dep.driver.id = ?2 "
			+ "ORDER BY dep.session.sessionStartTime desc, dep.points desc")
	List<Object[]> getDriverPointsInEvent(Long eventEditionId, Long driverId);
	
	@Query("SELECT ee.event.name, es.name, dep.driver.name, dep.driver.surname, SUM(dep.points) as points "
			+ "FROM DriverEventPoints dep, EventSession es, EventEdition ee "
			+ "WHERE dep.session.eventEdition.seriesEdition.id = ?1 and dep.session = es and es.eventEdition = ee "
			+ "GROUP BY ee.longEventName, es.name, dep.driver.name, dep.driver.surname "
			+ "ORDER BY es.sessionStartTime ASC, points DESC")
	List<Object[]> getDriversPointsInSeries(Long seriesEditionId);
}

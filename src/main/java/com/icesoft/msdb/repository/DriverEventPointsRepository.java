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
			+ "FROM DriverEventPoints dep, EventEdition ee, EventSession es "
			+ "WHERE ee.id = ?1 AND es.eventEdition = ee AND dep.session = es AND dep.driver.id = ?2")
	Float getDriverPointsInEvent(Long eventEditionId, Long driverId);
	
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
	List<Object[]> getListDriverPointsInEvent(Long eventEditionId, Long driverId);
	
	@Query("SELECT COUNT(DISTINCT e) "
			+ "FROM EventEdition e, EventSession es, DriverEventPoints dep "
			+ "WHERE e.seriesEdition.id = ?1 AND es.eventEdition = e AND dep.session = es")
	Integer countPunctuatedEventsInSeries(Long seriesEditionId);
}

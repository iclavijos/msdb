package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.DriverEventPoints;

public interface DriverEventPointsRepository extends JpaRepository<DriverEventPoints,Long> {

	@Modifying
	@Query("DELETE FROM DriverEventPoints dep WHERE dep.session.id = ?1 and dep.seriesEdition.id = ?2")
	@Transactional
	void deleteSessionPoints(Long sessionId, Long seriesId);

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

	@Query("SELECT dep.driver.id, dep.driver.name, dep.driver.surname, sum(points) as points, count(*) as num_points "
			+ "FROM DriverEventPoints dep "
			+ "WHERE dep.points <> 0 AND dep.seriesEdition.id = ?1 and dep.session.eventEdition.id = ?2 "
			+ "GROUP BY dep.driver.id "
			+ "ORDER BY points desc")
	List<Object[]> getDriversPointsInEvent(Long seriesId, Long eventEditionId);

	@Query("SELECT dep.id, dep.driver.name, dep.driver.surname, dep.points, dep.reason "
			+ "FROM DriverEventPoints dep "
			+ "WHERE dep.points <> 0 AND dep.session.eventEdition.id = ?1 AND dep.driver.id = ?2 "
			+ "ORDER BY dep.session.sessionStartTime desc, dep.points desc")
	List<Object[]> getDriverPointsInEvent(Long eventEditionId, Long driverId);

	@Query(value = "SELECT e.name eventName, es.name sessionName, d.name driverName, d.surname, SUM(dep.points) as points, c.shortname " +
        "FROM series_edition se join driver_event_points dep on dep.series_edition_id = se.id " +
        "join event_session es on dep.session_id = es.id " +
        "join event_edition ee on es.event_edition_id = ee.id " +
        "join event e on ee.event_id = e.id " +
        "join driver d on dep.driver_id = d.id " +
        "left join category c on dep.category_id = c.id " +
        "WHERE se.id = ?1 " +
        "GROUP BY ee.long_event_name, es.name, d.name, d.surname " +
        "ORDER BY es.session_start_time ASC, points DESC", nativeQuery = true)
	List<Object[]> getDriversPointsInSeries(Long seriesEditionId);
}

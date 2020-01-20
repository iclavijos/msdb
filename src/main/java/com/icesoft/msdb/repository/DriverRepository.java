package com.icesoft.msdb.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.SeriesEdition;

/**
 * Spring Data  repository for the Driver entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DriverRepository extends JpaRepository<Driver,Long> {

	List<Driver> findByNameAndSurnameAndBirthDateAllIgnoreCase(String name, String surname, LocalDate date);

	List<Driver> findByIdIn(List<Long> ids);

	@Query("SELECT DISTINCT eee.drivers FROM EventEditionEntry eee WHERE ?1 MEMBER OF eee.eventEdition.seriesEditions")
	List<Driver> findDriversInSeries(SeriesEdition seriesEdition);

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select d from Driver d JOIN FETCH d.nationality n")
	@Transactional(readOnly=true)
	Stream<Driver> streamAll();
}

package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Driver;

/**
 * Spring Data JPA repository for the Driver entity.
 */
public interface DriverRepository extends JpaRepository<Driver,Long> {

	@Query("select d from Driver d where "
			+ "lower(d.name) like concat('%', lower(?1),'%') or "
			+ "lower(d.surname) like concat('%', lower(?1),'%')")
	Page<Driver> search(String searchValue, Pageable page);
}

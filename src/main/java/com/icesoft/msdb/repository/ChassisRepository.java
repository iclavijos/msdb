package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Chassis;

/**
 * Spring Data JPA repository for the Chassis entity.
 */
public interface ChassisRepository extends JpaRepository<Chassis,Long> {

	@Query("select c from Chassis c where c.name like %?1% or c.manufacturer like %?1%")
	List<Chassis> search(String searchValue);
}

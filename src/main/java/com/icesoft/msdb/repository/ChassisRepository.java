package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Chassis;

/**
 * Spring Data JPA repository for the Chassis entity.
 */
public interface ChassisRepository extends JpaRepository<Chassis,Long> {

	@Query("select c from Chassis c where c.name like lower(concat('%', ?1,'%')) or c.manufacturer like lower(concat('%', ?1,'%'))")
	Page<Chassis> search(String searchValue, Pageable page);
}

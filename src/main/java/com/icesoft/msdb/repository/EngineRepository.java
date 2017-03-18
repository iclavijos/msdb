package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Engine;

/**
 * Spring Data JPA repository for the Engine entity.
 */
public interface EngineRepository extends JpaRepository<Engine,Long> {

	@Query("select e from Engine e where e.name like lower(concat('%', ?1,'%')) or e.manufacturer like lower(concat('%', ?1,'%'))")
	Page<Engine> search(String searchValue, Pageable page);
	
	List<Engine> findByName(String name);
	
	List<Engine> findByNameAndManufacturer(String name, String manufacturer);
}

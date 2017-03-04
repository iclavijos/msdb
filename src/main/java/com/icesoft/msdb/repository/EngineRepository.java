package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Engine;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Engine entity.
 */
public interface EngineRepository extends JpaRepository<Engine,Long> {

	@Query("select e from Engine e where e.name like lower(concat('%', ?1,'%')) or e.manufacturer like lower(concat('%', ?1,'%'))")
	List<Engine> search(String searchValue);
}

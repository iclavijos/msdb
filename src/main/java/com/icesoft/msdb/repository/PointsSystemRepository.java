package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.PointsSystem;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the PointsSystem entity.
 */
public interface PointsSystemRepository extends JpaRepository<PointsSystem,Long> {

	@Query("select p from PointsSystem p where p.name like %?1% or p.description like %?1%")
	List<PointsSystem> search(String searchValue);
}

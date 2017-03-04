package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.FuelProvider;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the FuelProvider entity.
 */
public interface FuelProviderRepository extends JpaRepository<FuelProvider,Long> {

	@Query("select f from FuelProvider f where f.name like lower(concat('%', ?1,'%'))")
	List<FuelProvider> search(String searchValue);
}

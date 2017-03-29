package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.FuelProvider;

/**
 * Spring Data JPA repository for the FuelProvider entity.
 */
public interface FuelProviderRepository extends JpaRepository<FuelProvider,Long> {

	@Query("select f from FuelProvider f where f.name like lower(concat('%', ?1,'%'))")
	Page<FuelProvider> search(String searchValue, Pageable pageable);
}

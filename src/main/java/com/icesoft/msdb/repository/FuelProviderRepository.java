package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.FuelProvider;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the FuelProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuelProviderRepository extends JpaRepository<FuelProvider, Long> {

}

package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.FuelProvider;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the FuelProvider entity.
 */
@SuppressWarnings("unused")
public interface FuelProviderRepository extends JpaRepository<FuelProvider,Long> {

}

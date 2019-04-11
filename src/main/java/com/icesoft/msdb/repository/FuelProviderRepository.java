package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.FuelProvider;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the FuelProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuelProviderRepository extends JpaRepository<FuelProvider, Long> {

}

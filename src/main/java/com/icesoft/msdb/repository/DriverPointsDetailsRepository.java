package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.DriverPointsDetails;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DriverPointsDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DriverPointsDetailsRepository extends JpaRepository<DriverPointsDetails,Long> {
    
}

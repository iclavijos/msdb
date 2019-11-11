package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.DriverPointsDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DriverPointsDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DriverPointsDetailsRepository extends JpaRepository<DriverPointsDetails, Long> {

}

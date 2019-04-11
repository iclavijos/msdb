package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Chassis;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Chassis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChassisRepository extends JpaRepository<Chassis, Long> {

}

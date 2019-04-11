package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Chassis;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Chassis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChassisRepository extends JpaRepository<Chassis, Long> {

}

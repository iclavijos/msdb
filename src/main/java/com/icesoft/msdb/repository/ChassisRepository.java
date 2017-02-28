package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Chassis;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Chassis entity.
 */
@SuppressWarnings("unused")
public interface ChassisRepository extends JpaRepository<Chassis,Long> {

}

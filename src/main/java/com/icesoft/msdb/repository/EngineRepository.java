package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Engine;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Engine entity.
 */
@SuppressWarnings("unused")
public interface EngineRepository extends JpaRepository<Engine,Long> {

}

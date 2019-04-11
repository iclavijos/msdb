package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Engine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Engine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EngineRepository extends JpaRepository<Engine, Long> {

}

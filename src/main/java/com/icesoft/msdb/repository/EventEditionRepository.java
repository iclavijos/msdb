package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEdition;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the EventEdition entity.
 */
@SuppressWarnings("unused")
public interface EventEditionRepository extends JpaRepository<EventEdition,Long> {

}

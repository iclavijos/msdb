package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntryResult;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EventEntryResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEntryResultRepository extends JpaRepository<EventEntryResult, Long> {

}

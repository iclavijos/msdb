package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntryResult;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the EventEntryResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEntryResultRepository extends JpaRepository<EventEntryResult, Long> {

}

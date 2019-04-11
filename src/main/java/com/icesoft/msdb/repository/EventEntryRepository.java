package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the EventEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEntryRepository extends JpaRepository<EventEntry, Long> {

}

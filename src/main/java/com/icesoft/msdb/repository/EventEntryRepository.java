package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.EventEntry;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the EventEntry entity.
 */
@SuppressWarnings("unused")
public interface EventEntryRepository extends JpaRepository<EventEntry,Long> {

}

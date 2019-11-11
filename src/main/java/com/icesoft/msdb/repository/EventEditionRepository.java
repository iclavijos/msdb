package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.EventEdition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the EventEdition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEditionRepository extends JpaRepository<EventEdition, Long> {

}

package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.DriverEntry;
import com.icesoft.msdb.domain.DriverEntryPK;
import com.icesoft.msdb.domain.EventEditionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverEntryRepository extends JpaRepository<DriverEntry, DriverEntryPK> {

    void deleteByEventEntry(EventEditionEntry entry);

    void deleteByIdEntryId(Long entryId);
}

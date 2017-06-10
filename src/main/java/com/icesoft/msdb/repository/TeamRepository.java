package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.icesoft.msdb.domain.Team;

/**
 * Spring Data JPA repository for the Team entity.
 */
public interface TeamRepository extends JpaRepository<Team,Long> {

    Page<Team> findByNameContainsIgnoreCaseOrderByNameAsc(String searchValue, Pageable pageable);
}

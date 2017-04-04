package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Team;

/**
 * Spring Data JPA repository for the Team entity.
 */
public interface TeamRepository extends JpaRepository<Team,Long> {

    @Query("select t from Team t where t.name like lower(concat('%', ?1,'%')) or t.hqLocation like lower(concat('%', ?1,'%'))")
    List<Team> search(String searchValue);
}

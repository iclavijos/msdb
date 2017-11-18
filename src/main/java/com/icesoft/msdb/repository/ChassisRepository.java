package com.icesoft.msdb.repository;

import java.util.stream.Stream;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Chassis;

/**
 * Spring Data JPA repository for the Chassis entity.
 */
@Repository
public interface ChassisRepository extends JpaRepository<Chassis,Long> {

	@EntityGraph(value="ChassisWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<Chassis> streamAllByIdNotNull();
}

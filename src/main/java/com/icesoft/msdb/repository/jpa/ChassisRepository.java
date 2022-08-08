package com.icesoft.msdb.repository.jpa;

import java.util.stream.Stream;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Chassis;

/**
 * Spring Data  repository for the Chassis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChassisRepository extends JpaRepository<Chassis,Long> {

	@EntityGraph(value="ChassisWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<Chassis> streamAllByIdNotNull();
}

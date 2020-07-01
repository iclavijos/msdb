package com.icesoft.msdb.repository;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Engine;

/**
 * Spring Data  repository for the Engine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EngineRepository extends JpaRepository<Engine,Long> {

	@EntityGraph(value="EngineWithoutRelations", type=EntityGraphType.LOAD)
	@Transactional(readOnly=true)
	Stream<Engine> readAllByIdNotNull();

	List<Engine> findByName(String name);

	List<Engine> findByNameAndManufacturer(String name, String manufacturer);
}

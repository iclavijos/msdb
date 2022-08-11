package com.icesoft.msdb.repository.jpa;

import static org.hibernate.jpa.AvailableHints.HINT_FETCH_SIZE;

import java.util.stream.Stream;

import jakarta.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.FuelProvider;

/**
 * Spring Data  repository for the FuelProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuelProviderRepository extends JpaRepository<FuelProvider,Long> {

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "1"))
	@Query(value = "select f from FuelProvider f")
	@Transactional(readOnly=true)
	Stream<FuelProvider> streamAll();
}

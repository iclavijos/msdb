package com.icesoft.msdb.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.util.stream.Stream;

import javax.persistence.QueryHint;

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

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select f from FuelProvider f")
	@Transactional(readOnly=true)
	Stream<FuelProvider> streamAll();
}

package com.icesoft.msdb.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.TyreProvider;

/**
 * Spring Data  repository for the TyreProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TyreProviderRepository extends JpaRepository<TyreProvider,Long> {

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select t from TyreProvider t")
	@Transactional(readOnly=true)
	Stream<TyreProvider> streamAll();
}

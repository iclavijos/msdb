package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.TyreProvider;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the TyreProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TyreProviderRepository extends JpaRepository<TyreProvider, Long> {

}

package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.TyreProvider;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the TyreProvider entity.
 */
@SuppressWarnings("unused")
public interface TyreProviderRepository extends JpaRepository<TyreProvider,Long> {

}

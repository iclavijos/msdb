package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.TyreProvider;

/**
 * Spring Data JPA repository for the TyreProvider entity.
 */
@Repository
public interface TyreProviderRepository extends JpaRepository<TyreProvider,Long> {

//	@Query("select t from TyreProvider t where t.name like lower(concat('%', ?1,'%'))")
//	Page<TyreProvider> search(String searchValue, Pageable pageable);
}

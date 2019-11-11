package com.icesoft.msdb.repository;
import com.icesoft.msdb.domain.TyreProvider;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TyreProvider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TyreProviderRepository extends JpaRepository<TyreProvider, Long> {

}

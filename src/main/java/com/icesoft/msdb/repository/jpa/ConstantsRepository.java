package com.icesoft.msdb.repository.jpa;

import com.icesoft.msdb.domain.Constants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConstantsRepository extends JpaRepository<Constants,Long> {

	Optional<Constants> findByName(String constantName);
}

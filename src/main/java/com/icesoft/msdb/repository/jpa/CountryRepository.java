package com.icesoft.msdb.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country,Long> {

	List<Country> findByCountryNameContaining(String searchValue);

	Optional<Country> findByCountryCode(String countryCode);
}

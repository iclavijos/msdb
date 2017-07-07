package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country,Long> {

	List<Country> findByCountryNameContaining(String searchValue);
}

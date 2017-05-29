package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.icesoft.msdb.domain.Country;

public interface CountryRepository extends JpaRepository<Country,Long> {

	List<Country> findByCountryNameContaining(String searchValue);
}

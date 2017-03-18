package com.icesoft.msdb.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Car;

/**
 * Spring Data JPA repository for the Car entity.
 */
public interface CarRepository extends JpaRepository<Car,Long> {

	@Query("select c from Car c where c.name like lower(concat('%', ?1,'%')) or c.manufacturer like lower(concat('%', ?1,'%'))")
	Page<Car> search(String searchValue, Pageable page);
}

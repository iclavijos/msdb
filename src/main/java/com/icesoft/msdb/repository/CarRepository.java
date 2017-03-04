package com.icesoft.msdb.repository;

import com.icesoft.msdb.domain.Car;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Car entity.
 */
public interface CarRepository extends JpaRepository<Car,Long> {

	@Query("select c from Car c where c.name like lower(concat('%', ?1,'%')) or c.manufacturer like lower(concat('%', ?1,'%'))")
	List<Car> search(String searchValue);
}

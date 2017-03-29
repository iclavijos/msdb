package com.icesoft.msdb.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icesoft.msdb.domain.Category;

/**
 * Spring Data JPA repository for the Category entity.
 */
public interface CategoryRepository extends JpaRepository<Category,Long> {
	
	List<Category> findAllByOrderByNameAsc();

	@Query("select c from Category c where c.name like lower(concat('%', ?1,'%')) or c.shortname like lower(concat('%', ?1,'%'))")
	Page<Category> search(String searchValue, Pageable page);
}

package com.icesoft.msdb.repository.jpa;

import static org.hibernate.jpa.AvailableHints.HINT_FETCH_SIZE;

import java.util.SortedSet;
import java.util.stream.Stream;

import jakarta.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Category;

/**
 * Spring Data  repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    SortedSet<Category> findByNameIn(String[] names);

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "1"))
	@Query(value = "select c from Category c")
	@Transactional(readOnly=true)
	Stream<Category> streamAll();
}

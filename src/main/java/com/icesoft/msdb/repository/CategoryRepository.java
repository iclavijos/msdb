package com.icesoft.msdb.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.util.List;
import java.util.SortedSet;
import java.util.stream.Stream;

import javax.persistence.QueryHint;

import com.icesoft.msdb.domain.comparator.CategoryComparator;
import org.hibernate.annotations.SortComparator;
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

    @SortComparator(CategoryComparator.class)
    SortedSet<Category> findByNameIn(String[] names);

	@QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MIN_VALUE))
	@Query(value = "select c from Category c")
	@Transactional(readOnly=true)
	Stream<Category> streamAll();
}

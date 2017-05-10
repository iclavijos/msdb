package com.icesoft.msdb.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.lucene.search.Query;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.FullTextQuery;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.repository.SearchRepository;

@Repository
public class SearchRepositoryImpl implements SearchRepository {
	
	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public Page<EventEdition> searchEventEditions(String searchTems, Pageable pageable) {
		FullTextEntityManager fullTextEntityManager =
				org.hibernate.search.jpa.Search.
				getFullTextEntityManager(entityManager);

		// create the query using Hibernate Search query DSL
		QueryBuilder queryBuilder = 
				fullTextEntityManager.getSearchFactory()
				.buildQueryBuilder().forEntity(EventEdition.class).get();

		// a very basic query by keywords
		Query query = queryBuilder
				.keyword().wildcard()
				.onFields("shortEventName", "longEventName", "trackLayout.name", "trackLayout.racetrack.name", "trackLayout.racetrack.location")
				.matching(searchTems + "*")
				.createQuery();

		// wrap Lucene query in an Hibernate Query object
		FullTextQuery jpaQuery =
				fullTextEntityManager.createFullTextQuery(query, EventEdition.class);
		jpaQuery.setFirstResult(pageable.getOffset());
		jpaQuery.setMaxResults(pageable.getPageSize());

		// execute search and return results (sorted by relevance as default)
		@SuppressWarnings("unchecked")
		List<EventEdition> results = jpaQuery.getResultList();
		Page<EventEdition> page = new PageImpl<>(results, pageable, jpaQuery.getResultSize());

		return page;
	}
	
	public Page<EventEditionEntry> searchEntries(String searchTerms, Pageable pageable) {
		FullTextEntityManager fullTextEntityManager =
				org.hibernate.search.jpa.Search.
				getFullTextEntityManager(entityManager);

		// create the query using Hibernate Search query DSL
		QueryBuilder queryBuilder = 
				fullTextEntityManager.getSearchFactory()
				.buildQueryBuilder().forEntity(EventEditionEntry.class).get();
		
		//Look for any number in the query to use it as a edition year filter
		int numberFilter = -1;
		String[] terms = searchTerms.split("\\s+");
		for(String term : terms) {
			try {
				numberFilter = Integer.parseInt(term);
				break;
			} catch (NumberFormatException e) {}
		}
		
		Query qDriver = queryBuilder.keyword().fuzzy().boostedTo(2f).onFields( 
				"drivers.name", "drivers.surname").matching(searchTerms).createQuery();
		
		Query query = queryBuilder
					.bool()
						.should(qDriver)
						.should(queryBuilder.keyword().fuzzy().onFields(
								"entryName", 
								"eventEdition.longEventName", "eventEdition.shortEventName",
								"eventEdition.trackLayout.name", "eventEdition.trackLayout.racetrack.name", "eventEdition.trackLayout.racetrack.location",
								"engine.name", "engine.manufacturer", "engine.architecture").matching(searchTerms).createQuery())
					.createQuery();
		
		if (numberFilter > -1) {
			query = queryBuilder.bool()
						.should(queryBuilder.keyword().onField("eventEdition.editionYear").matching(numberFilter).createQuery())
						.should(query).createQuery();
		}

		// wrap Lucene query in an Hibernate Query object
		FullTextQuery jpaQuery =
				fullTextEntityManager.createFullTextQuery(query, EventEditionEntry.class);
		//jpaQuery.setProjection(ProjectionConstants.SCORE, ProjectionConstants.THIS);
		jpaQuery.setFirstResult(pageable.getOffset());
		jpaQuery.setMaxResults(pageable.getPageSize());

		// execute search and return results (sorted by relevance as default)
		@SuppressWarnings("unchecked")
		List<EventEditionEntry> results = jpaQuery.getResultList();
		//List<EventEditionEntry> results = tmp.stream().filter(r -> (float)r[0] > 0.5f).map(r-> (EventEditionEntry)r[1]).collect(Collectors.<EventEditionEntry> toList());
		Page<EventEditionEntry> page = new PageImpl<>(results, pageable, jpaQuery.getResultSize());

		return page;
	}

}

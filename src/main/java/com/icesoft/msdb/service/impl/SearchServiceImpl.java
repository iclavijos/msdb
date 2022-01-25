package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.elasticsearch.index.query.*;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortMode;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitsIterator;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.repository.CategoryRepository;
import com.icesoft.msdb.repository.ChassisRepository;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.EngineRepository;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventRepository;
import com.icesoft.msdb.repository.FuelProviderRepository;
import com.icesoft.msdb.repository.PointsSystemRepository;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.repository.SeriesRepository;
import com.icesoft.msdb.repository.TeamRepository;
import com.icesoft.msdb.repository.TyreProviderRepository;
import com.icesoft.msdb.repository.search.CategorySearchRepository;
import com.icesoft.msdb.repository.search.ChassisSearchRepository;
import com.icesoft.msdb.repository.search.DriverSearchRepository;
import com.icesoft.msdb.repository.search.EngineSearchRepository;
import com.icesoft.msdb.repository.search.EventEditionSearchRepository;
import com.icesoft.msdb.repository.search.EventEntrySearchRepository;
import com.icesoft.msdb.repository.search.EventSearchRepository;
import com.icesoft.msdb.repository.search.FuelProviderSearchRepository;
import com.icesoft.msdb.repository.search.PointsSystemSearchRepository;
import com.icesoft.msdb.repository.search.RacetrackLayoutSearchRepository;
import com.icesoft.msdb.repository.search.RacetrackSearchRepository;
import com.icesoft.msdb.repository.search.SeriesSearchRepository;
import com.icesoft.msdb.repository.search.TeamSearchRepository;
import com.icesoft.msdb.repository.search.TyreProviderSearchRepository;
import com.icesoft.msdb.service.SearchService;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@Transactional(readOnly=true)
public class SearchServiceImpl implements SearchService {

	private final Logger log = LoggerFactory.getLogger(SearchServiceImpl.class);

	@Autowired private DriverRepository driverRepo;
	@Autowired private DriverSearchRepository driverSearchRepo;
	@Autowired private TeamRepository teamRepo;
	@Autowired private TeamSearchRepository teamSearchRepo;
	@Autowired private EngineRepository engineRepo;
	@Autowired private EngineSearchRepository engineSearchRepo;
	@Autowired private ChassisRepository chassisRepo;
	@Autowired private ChassisSearchRepository chassisSearchRepo;
	@Autowired private EventEntryResultRepository resultsRepo;
	@Autowired private CategoryRepository categoryRepo;
	@Autowired private CategorySearchRepository categorySearchRepo;
	@Autowired private FuelProviderRepository fuelRepo;
	@Autowired private FuelProviderSearchRepository fuelSearchRepo;
	@Autowired private TyreProviderRepository tyreRepo;
	@Autowired private TyreProviderSearchRepository tyreSearchRepo;
	@Autowired private PointsSystemRepository pointsRepo;
	@Autowired private PointsSystemSearchRepository pointsSearchRepo;
	@Autowired private SeriesRepository seriesRepo;
	@Autowired private SeriesSearchRepository seriesSearchRepo;
	@Autowired private EventRepository eventRepo;
	@Autowired private EventSearchRepository eventSearchRepo;
	@Autowired private EventEditionRepository eventEditionRepo;
	@Autowired private EventEditionSearchRepository eventEditionSearchRepo;
	@Autowired private EventEntryRepository eventEntryRepo;
	@Autowired private EventEntrySearchRepository eventEntrySearchRepo;
	@Autowired private RacetrackRepository racetrackRepo;
	@Autowired private RacetrackSearchRepository racetrackSearchRepo;
	@Autowired private RacetrackLayoutRepository racetrackLayoutRepo;
	@Autowired private RacetrackLayoutSearchRepository racetrackLayoutSearchRepo;

	@Autowired @Qualifier("taskExecutor") private Executor executor;
	@Autowired private TransactionTemplate txTemplate;

    @Autowired private ElasticsearchOperations operations;

	@Override
	@Transactional()
	public void rebuildIndexes() {
		log.debug("Rebuilding search indexes");
        List<Runnable> tasks = new ArrayList<>();
        tasks.add(() -> {
            log.debug("Building Drivers index");
            txTemplate.execute(status -> updateSearchIndex(driverRepo.streamAll(), driverSearchRepo));
            log.debug("Building Drivers index done");
        });
        tasks.add(() -> {
            log.debug("Building Teams index");
            txTemplate.execute(status -> updateSearchIndex(teamRepo.streamAll(), teamSearchRepo));
            log.debug("Building Teams index done");
        });
        tasks.add(() -> {
            log.debug("Building Engines index");
            txTemplate.execute(status -> updateSearchIndex(engineRepo.readAllByIdNotNull(), engineSearchRepo));
            log.debug("Building Engines index done");
        });
        tasks.add(() -> {
            log.debug("Building Chassis index");
            txTemplate.execute(status -> updateSearchIndex(chassisRepo.streamAllByIdNotNull(), chassisSearchRepo));
            log.debug("Building Chassis index done");
        });
        tasks.add(() -> {
            log.debug("Building Categories index");
            txTemplate.execute(status -> updateSearchIndex(categoryRepo.streamAll(), categorySearchRepo));
            log.debug("Building Categories index done");
        });
        tasks.add(() -> {
            log.debug("Building Fuel suppliers index");
            txTemplate.execute(status -> updateSearchIndex(fuelRepo.streamAll(), fuelSearchRepo));
            log.debug("Building Fuel suppliers index done");
        });
        tasks.add(() -> {
            log.debug("Building Tyre suppliers index");
            txTemplate.execute(status -> updateSearchIndex(tyreRepo.streamAll(), tyreSearchRepo));
            log.debug("Building Tyre suppliers index done");
        });
//        tasks.add(() -> {
//            log.debug("Building Points systems index");
//            txTemplate.execute(status -> updateSearchIndex(pointsRepo.streamAll(), pointsSearchRepo));
//            log.debug("Building Points systems index done");
//        });
//        tasks.add(() -> {
//            log.debug("Building Events index");
//            txTemplate.execute(status -> updateSearchIndex(eventRepo.readAllByIdNotNull(), eventSearchRepo));
//            log.debug("Building Events index done");
//        });
//        tasks.add(() -> {
//            log.debug("Building Series index");
//            txTemplate.execute(status -> updateSearchIndex(seriesRepo.streamAll(), seriesSearchRepo));
//            log.debug("Building Series index done");
//        });
//        tasks.add(() -> {
//            log.debug("Building Event Editions index");
//            txTemplate.execute(status -> updateSearchIndex(eventEditionRepo.streamAllByIdNotNull(), eventEditionSearchRepo));
//            log.debug("Building Event Editions index done");
//        });
        tasks.add(() -> {
            log.debug("Building Racetracks & layouts index");
            txTemplate.execute(status -> {
                updateSearchIndex(racetrackRepo.streamAll(), racetrackSearchRepo);
                log.debug("Racetracks done. Now layouts");
                updateSearchIndex(racetrackLayoutRepo.streamAll(), racetrackLayoutSearchRepo);
                return null;
            });
            log.debug("Building Racetracks & layouts index done");
        });

        tasks.forEach(task -> {
            executor.execute(task);
        });
        log.debug("Rebuilding search indexes completed");

        //log.debug("Building Event Entries index");
        //updateSearchIndex(eventEntryRepo.streamAllByIdNotNull(), eventEntrySearchRepo);

	}

	private <T> Void updateSearchIndex(final Stream<T> stream, final ElasticsearchRepository<T, Long> searchRepo) {
		searchRepo.deleteAll();
		log.trace("Index deleted. Rebuilding...");
		stream.parallel().forEach(elem -> searchRepo.save(elem));
		stream.close();
		return null;
	}

    @Override
    public <T> Page<T> performWildcardSearch(Class<T> searchClass, String query, List<String> fields, Pageable pageable) {
        String[] queryTerms = query.split(" ");
        BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();
        fields.stream().forEach(field -> {
            Arrays.stream(queryTerms).forEach(queryTerm -> {
                boolQueryBuilder.should(
                    QueryBuilders.wildcardQuery(field, "*" + queryTerm + "*"));
                boolQueryBuilder.should(
                    QueryBuilders.matchQuery(field, queryTerm));
            });
        });

        String queryString = Arrays.stream(queryTerms)
            .map(value -> value + "*")
            .collect(Collectors.joining("~2 | "));
        SimpleQueryStringBuilder queryBuilder = new SimpleQueryStringBuilder(queryString + "~2");
        fields.parallelStream().forEach(field -> queryBuilder.field(field));

        boolQueryBuilder.should(queryBuilder);
        NativeSearchQueryBuilder nativeSearchQueryBuilder = new NativeSearchQueryBuilder()
            .withQuery(boolQueryBuilder);
        pageable.getSort().forEach(sort -> nativeSearchQueryBuilder
            .withSort(SortBuilders
                .fieldSort(sort.getProperty())
                .order(sort.getDirection().isAscending() ? SortOrder.ASC : SortOrder.DESC)));

        NativeSearchQuery nativeQuery = nativeSearchQueryBuilder.build();

        SearchHitsIterator<T> hits = operations.searchForStream(nativeQuery, searchClass);
        Page<T> result = new PageImpl(
            hits.stream()
                .skip(pageable.getPageNumber() * pageable.getPageSize())
                .limit(pageable.getPageSize())
                .map(SearchHit::getContent)
                .collect(Collectors.toList()),
            pageable,
            hits.getTotalHits()
        );

        return result;
    }

}

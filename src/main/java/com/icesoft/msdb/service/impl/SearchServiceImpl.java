package com.icesoft.msdb.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.icesoft.msdb.MSDBException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.EventEditionEntry;
import com.icesoft.msdb.domain.EventEntryResult;
import com.icesoft.msdb.domain.enums.SessionType;
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
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.Assert;

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
	@Autowired TransactionTemplate txTemplate;

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
            log.debug("Building Engines index");
            txTemplate.execute(status -> updateSearchIndex(engineRepo.readAllByIdNotNull(), engineSearchRepo));
            log.debug("Building Engines index done");
        });
        tasks.add(() -> {
            log.debug("Building Teams index");
            txTemplate.execute(status -> updateSearchIndex(teamRepo.streamAll(), teamSearchRepo));
            log.debug("Building Teams index done");
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
        tasks.add(() -> {
            log.debug("Building Points systems index");
            txTemplate.execute(status -> updateSearchIndex(pointsRepo.streamAll(), pointsSearchRepo));
            log.debug("Building Points systems index done");
        });
        tasks.add(() -> {
            log.debug("Building Events index");
            txTemplate.execute(status -> updateSearchIndex(eventRepo.readAllByIdNotNull(), eventSearchRepo));
            log.debug("Building Events index done");
        });
        tasks.add(() -> {
            log.debug("Building Series index");
            txTemplate.execute(status -> updateSearchIndex(seriesRepo.streamAll(), seriesSearchRepo));
            log.debug("Building Series index done");
        });
        tasks.add(() -> {
            log.debug("Building Event Editions index");
            txTemplate.execute(status -> updateSearchIndex(eventEditionRepo.streamAllByIdNotNull(), eventEditionSearchRepo));
            log.debug("Building Event Editions index done");
        });
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
    public <T> Page<T> performWildcardSearch(final ElasticsearchRepository<T, Long> searchRepo, String query, String[] fields, Pageable pageable) {
        BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
        for(String field: fields) {
            queryBuilder.should(
                QueryBuilders.wildcardQuery(field, "*" + query + "*"));
        }

        return searchRepo.search(queryBuilder, pageable);
    }

	@Override
	public Page<EventEntrySearchResultDTO> searchEntries(String searchTerms, Pageable pageable) {
		String searchValue = '*' + searchTerms + '*';
		Page<EventEditionEntry> tmp = eventEntrySearchRepo.search(queryStringQuery(searchValue), pageable);
		List<EventEntrySearchResultDTO> aux = tmp.getContent().parallelStream()
				.map(this::createDTO)
				.collect(Collectors.<EventEntrySearchResultDTO> toList());
		return new PageImpl<>(aux, pageable, tmp.getTotalElements());
	}

	private EventEntrySearchResultDTO createDTO(EventEditionEntry entry) {
		long poleTime;
		Integer polePosition;
		long raceFastLap;
		Integer racePosition;
		String retirement = "";
		LocalDate sessionDate;

		List<EventEntryResult> results = resultsRepo.findByEntryId(entry.getId());

		List<EventEntryResult> qResults = results.stream()
				.filter(r -> r.getSession().getSessionType() == SessionType.QUALIFYING).collect(Collectors.<EventEntryResult> toList());
		if (qResults != null && !qResults.isEmpty()) {
			poleTime = qResults.get(0).getBestLapTime() != null ? qResults.get(0).getBestLapTime() : 0;
			polePosition = qResults.get(0).getFinalPosition();
		} else {
			poleTime = 0;
			polePosition = 0;
		}

		List<EventEntryResult> rResults = results.stream()
				.filter(r -> r.getSession().getSessionType() == SessionType.RACE).collect(Collectors.<EventEntryResult> toList());
		if (rResults != null && !rResults.isEmpty()) {
			EventEntryResult result = rResults.get(0);
			if (result.isRetired()) {
				if (result.getBestLapTime() == null) {
					raceFastLap = 0;
				} else {
					raceFastLap = result.getBestLapTime();
				}
				retirement = result.getCause();
			} else {
				if (result.getBestLapTime() != null) {
					raceFastLap = result.getBestLapTime();
				} else {
					raceFastLap = 0;
				}
			}
			racePosition = result.getFinalPosition();
			sessionDate = result.getSession().getSessionStartTimeDate().toLocalDate();
		} else {
			raceFastLap = 0;
			racePosition = 0;
			sessionDate = null;
		}

		EventEntrySearchResultDTO dto = new EventEntrySearchResultDTO(entry, sessionDate, poleTime, raceFastLap, polePosition, racePosition, retirement);

		return dto;
	}

}

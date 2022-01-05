package com.icesoft.msdb.web.rest.stats;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ForkJoinPool;
import java.util.stream.Collectors;

import tech.jhipster.web.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;
import org.springframework.web.context.request.async.DeferredResult;

@RestController
@RequestMapping()
public class StatisticsResource {

	private final Logger log = LoggerFactory.getLogger(StatisticsResource.class);

	private final EventEditionRepository eventEditionRepo;
	private final SeriesEditionRepository seriesEditionRepo;
	private final SeriesEditionService seriesEditionService;
	private final StatisticsService statsService;

	public StatisticsResource(EventEditionRepository eventEditionRepo, SeriesEditionRepository seriesEditionRepo,
			SeriesEditionService seriesEditionServ, StatisticsService statsService) {
		this.eventEditionRepo = eventEditionRepo;
		this.seriesEditionRepo = seriesEditionRepo;
		this.seriesEditionService = seriesEditionServ;
		this.statsService = statsService;
	}

	@PutMapping("/management/stats/rebuild")
	@Secured({AuthoritiesConstants.ADMIN})
	@Transactional
	public DeferredResult<ResponseEntity<Void>> rebuildAllStatistics() {
		log.info("Rebuilding all statistics - Event based ones...");
        DeferredResult<ResponseEntity<Void>> output = new DeferredResult<>(1800000L);

        output.onError((Throwable t) -> {
            output.setErrorResult(
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(t.getLocalizedMessage()));
        });

        ForkJoinPool.commonPool().submit(() -> {
            statsService.deleteAllStatistics();
            eventEditionRepo.findAllByOrderByEventDateAsc().stream()
                .forEach(event -> statsService.buildEventStatistics(event));
            log.info("Statistics rebuilt...");
            output.setResult(ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("motorsportsDatabaseApp.stats.home.rebuilt", true, "statistics", null))
                .build());
        });

        return output;

//		seriesEditionRepo.findAll().stream()
//			.forEach(s -> {
//				List<Long> ids = seriesEditionService.getSeriesDriversChampions(s.getId()).stream().map(d -> d.getId()).collect(Collectors.toList());
//				//seriesEditionService.setSeriesDriversChampions(s.getId(), ids);
//			});
	}

}

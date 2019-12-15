package com.icesoft.msdb.web.rest.stats;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import io.github.jhipster.web.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SeriesEditionService;
import com.icesoft.msdb.service.StatisticsService;

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

	@GetMapping("/management/stats/rebuild")
	@Secured({AuthoritiesConstants.ADMIN})
	@Transactional
	public CompletableFuture<ResponseEntity<Void>> rebuildAllStatistics() {
		log.info("Rebuilding all statistics - Event based ones...");
		statsService.deleteAllStatistics();
		eventEditionRepo.findAllByOrderByEventDateAsc().stream()
			.forEach(event -> statsService.buildEventStatistics(event));
		log.info("Statistics rebuilt...");

		seriesEditionRepo.findAll().stream()
			.forEach(s -> {
				List<Long> ids = seriesEditionService.getSeriesDriversChampions(s.getId()).stream().map(d -> d.getId()).collect(Collectors.toList());
				//seriesEditionService.setSeriesDriversChampions(s.getId(), ids);
			});
		return CompletableFuture.completedFuture(ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("motorsportsDatabaseApp.stats.home.rebuilt", true, "statistics", null))
            .build());
	}

}

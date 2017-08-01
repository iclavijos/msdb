package com.icesoft.msdb.web.rest.stats;

import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.web.rest.util.HeaderUtil;

@RestController
@RequestMapping()
public class StatisticsResource {
	
	private final Logger log = LoggerFactory.getLogger(StatisticsResource.class);
	
	private final EventEditionRepository eventEditionRepo;
	private final StatisticsService statsService;
	
	public StatisticsResource(EventEditionRepository eventEditionRepo, StatisticsService statsService) {
		this.eventEditionRepo = eventEditionRepo;
		this.statsService = statsService;
	}
	
	@GetMapping("/management/stats/rebuild")
	@Secured({AuthoritiesConstants.ADMIN})
	@Transactional
	public CompletableFuture<ResponseEntity<Void>> rebuildAllStatistics() {
		log.info("Rebuilding all statistics...");
		statsService.deleteStatistics();
		eventEditionRepo.findAllByOrderByEventDateAsc().parallelStream()
			.forEach(event -> statsService.buildEventStatistics(event));
		log.info("Statistics rebuilt...");
		return CompletableFuture.completedFuture(ResponseEntity.ok().headers(HeaderUtil.createAlert("Statistics rebuilt", null)).build());
	}
	
}

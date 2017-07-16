package com.icesoft.msdb.web.rest;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.DriverStatsDTO;
import com.icesoft.msdb.web.rest.util.HeaderUtil;

import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping()
public class StatisticsResource {
	
	private final Logger log = LoggerFactory.getLogger(StatisticsResource.class);
	
	private final StatisticsService statsService;
	
	public StatisticsResource(StatisticsService statsService) {
		this.statsService = statsService;
	}
	
	@GetMapping("/management/stats/rebuild")
	//@Secured({AuthoritiesConstants.ADMIN})
	@Async
	public CompletableFuture<ResponseEntity<Void>> rebuildAllStatistics() {
		statsService.rebuildStatistics();
		
		return CompletableFuture.completedFuture(ResponseEntity.ok().headers(HeaderUtil.createAlert("Statistics rebuilt", null)).build());
	}
	
	/**
	 * Return global statistics for every category in which 'driverId' has competed during his/her career
	 * @param driverId
	 */
	@GetMapping("/api/stats/driver/{driverId}")
	public ResponseEntity<List<DriverStatsDTO>> getStatistics(@PathVariable Long driverId) {
		Map<String, Statistics> tmp = statsService.getDriverStatistics(driverId);
		List<DriverStatsDTO> result = tmp.entrySet().stream()
			.map((entry) -> new DriverStatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/driver/{driverId}/{year}")
	public ResponseEntity<List<DriverStatsDTO>> getStatistics(@PathVariable Long driverId, @PathVariable String year) {
		Map<String, Statistics> tmp = statsService.getDriverStatistics(driverId);
		List<DriverStatsDTO> result = tmp.entrySet().stream()
			.map((entry) -> new DriverStatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	
}

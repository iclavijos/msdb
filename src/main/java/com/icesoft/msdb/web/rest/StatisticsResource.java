package com.icesoft.msdb.web.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.StatsDTO;
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
	public ResponseEntity<List<StatsDTO>> getDriverStatistics(@PathVariable Long driverId) {
		Map<String, Statistics> mapStats = 
				Optional.ofNullable(statsService.getDriverStatistics(driverId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/driver/{driverId}/{year}")
	public ResponseEntity<List<StatsDTO>> getDriverStatistics(@PathVariable Long driverId, @PathVariable Integer year) {
		Map<String, Statistics> mapStats = statsService.getDriverStatistics(driverId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/driver/{driverId}/years")
	public ResponseEntity<List<Integer>> getDriverYearsStatistics(@PathVariable Long driverId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getDriverYearsStatistics(driverId)));
	}
	
	@GetMapping("/api/stats/team/{teamId}")
	public ResponseEntity<List<StatsDTO>> getTeamStatistics(@PathVariable Long teamId) {
		Map<String, Statistics> mapStats = 
				Optional.ofNullable(statsService.getTeamStatistics(teamId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/team/{teamId}/{year}")
	public ResponseEntity<List<StatsDTO>> getTeamStatistics(@PathVariable Long teamId, @PathVariable Integer year) {
		Map<String, Statistics> mapStats = statsService.getTeamStatistics(teamId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/team/{teamId}/years")
	public ResponseEntity<List<Integer>> getTeamYearsStatistics(@PathVariable Long teamId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getTeamYearsStatistics(teamId)));
	}
	
	@GetMapping("/api/stats/chassis/{chassisId}")
	public ResponseEntity<List<StatsDTO>> getChassisStatistics(@PathVariable Long chassisId) {
		Map<String, Statistics> mapStats = 
				Optional.ofNullable(statsService.getChassisStatistics(chassisId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/chassis/{chassisId}/{year}")
	public ResponseEntity<List<StatsDTO>> getChassisStatistics(@PathVariable Long chassisId, @PathVariable Integer year) {
		Map<String, Statistics> mapStats = statsService.getChassisStatistics(chassisId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/chassis/{chassisId}/years")
	public ResponseEntity<List<Integer>> getChassisYearsStatistics(@PathVariable Long chassisId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getChassisYearsStatistics(chassisId)));
	}
	
	@GetMapping("/api/stats/engine/{engineId}")
	public ResponseEntity<List<StatsDTO>> getEngineStatistics(@PathVariable Long engineId) {
		Map<String, Statistics> mapStats = 
				Optional.ofNullable(statsService.getEngineStatistics(engineId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/engine/{engineId}/{year}")
	public ResponseEntity<List<StatsDTO>> getEngineStatistics(@PathVariable Long engineId, @PathVariable Integer year) {
		Map<String, Statistics> mapStats = statsService.getEngineStatistics(engineId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/api/stats/engine/{engineId}/years")
	public ResponseEntity<List<Integer>> getEngineYearsStatistics(@PathVariable Long engineId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getEngineYearsStatistics(engineId)));
	}
}

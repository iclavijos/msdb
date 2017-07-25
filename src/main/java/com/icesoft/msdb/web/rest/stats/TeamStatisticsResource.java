package com.icesoft.msdb.web.rest.stats;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.stats.Result;
import com.icesoft.msdb.domain.stats.Statistics;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.StatsDTO;

import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api/stats/teams")
public class TeamStatisticsResource {
	
	private final Logger log = LoggerFactory.getLogger(TeamStatisticsResource.class);
	
	private final StatisticsService statsService;
	
	public TeamStatisticsResource(StatisticsService statsService) {
		this.statsService = statsService;
	}

	/* (non-Javadoc)
	 * @see com.icesoft.msdb.web.rest.stats.StatsResourceInterface#getDriverStatistics(java.lang.Long)
	 */
	@GetMapping("/{teamId}")
	public ResponseEntity<List<StatsDTO>> getStatistics(@PathVariable Long teamId) {
		Map<String, Statistics> mapStats = 
				Optional.ofNullable(statsService.getTeamStatistics(teamId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/{teamId}/{year}")
	public ResponseEntity<List<StatsDTO>> getStatistics(@PathVariable Long teamId, @PathVariable Integer year) {
		Map<String, Statistics> mapStats = statsService.getTeamStatistics(teamId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	@GetMapping("/{teamId}/years")
	public ResponseEntity<List<Integer>> getYearsStatistics(@PathVariable Long teamId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getTeamYearsStatistics(teamId)));
	}
	
	@GetMapping("/{teamId}/participations/{category}")
	public ResponseEntity<List<Result>> getParticipations(@PathVariable Long teamId, @PathVariable String category) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getTeamStatistics(teamId).get(category).getParticipationsList()));
	}
}
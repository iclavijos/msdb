package com.icesoft.msdb.web.rest.stats;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.stats.ParticipantStatistics;
import com.icesoft.msdb.domain.stats.Result;
import com.icesoft.msdb.service.StatisticsService;
import com.icesoft.msdb.service.dto.StatsDTO;

import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api/stats/chassis")
public class ChassisStatisticsResource {

private final Logger log = LoggerFactory.getLogger(ChassisStatisticsResource.class);
	
	private final StatisticsService statsService;
	
	public ChassisStatisticsResource(StatisticsService statsService) {
		this.statsService = statsService;
	}

	/* (non-Javadoc)
	 * @see com.icesoft.msdb.web.rest.stats.StatsResourceInterface#getDriverStatistics(java.lang.Long)
	 */
	@GetMapping("/{elementId}")
	public ResponseEntity<List<StatsDTO>> getStatistics(@PathVariable Long elementId) {
		Map<String, ParticipantStatistics> mapStats = 
				Optional.ofNullable(statsService.getChassisStatistics(elementId))
					.orElse(new HashMap<>());
		
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	/* (non-Javadoc)
	 * @see com.icesoft.msdb.web.rest.stats.StatsResourceInterface#getDriverStatistics(java.lang.Long, java.lang.Integer)
	 */
	@GetMapping("/{elementId}/{year}")
	public ResponseEntity<List<StatsDTO>> getStatistics(@PathVariable Long elementId, @PathVariable String year) {
		Map<String, ParticipantStatistics> mapStats = statsService.getChassisStatistics(elementId, year);
		List<StatsDTO> result = mapStats.entrySet().stream()
			.map((entry) -> new StatsDTO(entry.getKey(), entry.getValue()))
			.sorted((e1, e2) -> e1.getCategory().compareTo(e2.getCategory()))
			.collect(Collectors.toList());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
	}
	
	/* (non-Javadoc)
	 * @see com.icesoft.msdb.web.rest.stats.StatsResourceInterface#getDriverYearsStatistics(java.lang.Long)
	 */
	@GetMapping("/{elementId}/years")
	public ResponseEntity<List<String>> getYearsStatistics(@PathVariable Long elementId) {
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getChassisYearsStatistics(elementId)));
	}
	
	/* (non-Javadoc)
	 * @see com.icesoft.msdb.web.rest.stats.StatsResourceInterface#getDriverParticipations(java.lang.Long, java.lang.String)
	 */
	@GetMapping("/{elementId}/participations/{category}")
	public ResponseEntity<List<Result>> getParticipations(@PathVariable Long elementId, @PathVariable String category, Pageable pageable) {
		log.debug("Retrieving statistics for driver {} and category {}", elementId, category);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(statsService.getChassisStatistics(elementId).get(category).getParticipationsList()));
	}
}

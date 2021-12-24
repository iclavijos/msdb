package com.icesoft.msdb.web.rest;

import java.util.*;
import java.util.stream.Collectors;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.DriverPerformance;
import com.icesoft.msdb.domain.LapInfo;
import com.icesoft.msdb.repository.SessionLapDataRepository;
import com.icesoft.msdb.service.dto.DriverRaceStatisticsDTO;
import com.icesoft.msdb.service.dto.LapsInfoDriversDTO;
import com.icesoft.msdb.service.dto.RacePositionsDTO;
import io.vavr.Tuple;
import io.vavr.Tuple4;
import io.vavr.Tuple5;
import io.vavr.Tuple6;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.domain.SessionLapData;
import com.icesoft.msdb.repository.EventEntryResultRepository;

@RestController
@RequestMapping("/api/event-editions")
@Transactional(readOnly = true)
public class LapsInfoResource {

	@Autowired SessionLapDataRepository repo;
	@Autowired EventEntryResultRepository resultsRepo;

	@GetMapping("/{eventEditionId}/laps")
	public ResponseEntity<Boolean> anyEventSessionLapDataLoaded(@PathVariable Long eventEditionId) {
		return ResponseEntity.ok(repo.anyEventSessionHasLapDataLoaded(eventEditionId));
	}

    @GetMapping("/session/{sessionId}/laps")
    public ResponseEntity<Boolean> sessionLapDataLoaded(@PathVariable Long sessionId) {
        return ResponseEntity.ok(repo.sessionHasLapDataLoaded(sessionId));
    }

	@GetMapping("/{sessionId}/laps/{raceNumber}")
	public ResponseEntity<List<LapInfo>> getLapsDriver(@PathVariable Long sessionId, @PathVariable String raceNumber) {
		return ResponseEntity.ok(repo.getDriverLaps(sessionId.toString(), raceNumber).get(0).getLaps());
	}

	@GetMapping("/event-sessions/{sessionId}/laps/drivers")
    @Cacheable(cacheNames = "lapsDriversCache")
	public ResponseEntity<List<LapsInfoDriversDTO>> getDriversWithData(@PathVariable Long sessionId) {
		List<LapsInfoDriversDTO> result;

        Map<String, List<LapInfo>> driversPerRaceNumber = repo.findById(sessionId.toString())
            .orElseThrow(() -> new MSDBException("Invalid session id " + sessionId))
            .getLaps().stream()
            .collect(Collectors.groupingBy(LapInfo::getRaceNumber));

        result = driversPerRaceNumber.keySet().stream()
            .sorted(Comparator.comparing(Integer::new))
            .map(raceNumber -> {
                String names = driversPerRaceNumber.get(raceNumber).stream()
                    .map(d -> d.getDriverName()).distinct().collect(Collectors.joining(", "));
                return new LapsInfoDriversDTO(raceNumber, names);
            }).collect(Collectors.toList());

		return ResponseEntity.ok(result);
	}

	@GetMapping("/event-sessions/{sessionId}/laps/averages")
    @Cacheable(cacheNames = "lapsAveragesCache")
    public ResponseEntity<List<DriverRaceStatisticsDTO>> getBestPerformers(@PathVariable Long sessionId) {
        SessionLapData sld = repo.findById(sessionId.toString())
            .orElseThrow(() -> new MSDBException("Invalid event session id " + sessionId));
	    return ResponseEntity.ok(
	        sld.getLapsPerDriver().parallelStream().map(DriverRaceStatisticsDTO::new).collect(Collectors.toList()));
    }

    @GetMapping("/event-sessions/{sessionId}/positions")
    @Cacheable(cacheNames = "positionsCache")
    public ResponseEntity<List<RacePositionsDTO>> getPositions(@PathVariable Long sessionId) {
        SessionLapData sld = repo.findById(sessionId.toString())
            .orElseThrow(() -> new MSDBException("Invalid event session id " + sessionId));
        List<RacePositionsDTO> result = new ArrayList<>();
        List<Tuple6<String, String, Long, Integer, Boolean, String>> posLap0 = resultsRepo.findBySessionIdOrderByFinalPositionAsc(sessionId).stream()
            .sorted(Comparator.comparing(r -> Optional.ofNullable(r.getStartingPosition()).orElse(901)))
            .map(r -> Tuple.of(r.getEntry().getRaceNumber(), r.getEntry().getDriversName(), 0L, 0, Boolean.FALSE, ""))
            .collect(Collectors.toList());
        RacePositionsDTO dataGrid = new RacePositionsDTO(0, posLap0);
        List<RacePositionsDTO> positionsPerLap = sld.getPositionsPerLap();

        // Set tyre compound for race start as same at the end of lap 1
        List<RacePositionsDTO.RacePosition> grid = dataGrid.getRacePositions();
        List<RacePositionsDTO.RacePosition> lap1 = positionsPerLap.get(0).getRacePositions();
        grid.forEach(driverGrid -> {
            String tyreCompound = lap1.stream()
                .filter(driverLap -> driverLap.getRaceNumber().equals(driverGrid.getRaceNumber()))
                .findFirst().get()
                .getTyreCompound();
            driverGrid.setTyreCompound(tyreCompound);
        });

        result.add(dataGrid);
        result.addAll(positionsPerLap);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/event-sessions/{sessionId}/driversPerformance")
    public ResponseEntity<List<DriverPerformance>> getDriversPerformance(@PathVariable Long sessionId) {
        SessionLapData sld = repo.findById(sessionId.toString())
            .orElseThrow(() -> new MSDBException("Invalid event session id " + sessionId));
        return ResponseEntity.ok(
            sld.getDriversPerformance().entrySet().stream()
                .map(entry -> entry.getValue())
                .collect(Collectors.toList())
        );
    }
}

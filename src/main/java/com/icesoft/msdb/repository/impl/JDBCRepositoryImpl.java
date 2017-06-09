package com.icesoft.msdb.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.TeamPointsDTO;

@Repository
public class JDBCRepositoryImpl {

	@Autowired private JdbcTemplate jdbcTemplate;
	
	public List<Object[]> getEventWinners(Long eventEditionId) {
		String query = "select entryId, catName, sessionName "
				+ "from events_results er "
				+ "where not exists ( "
				+ "select winners.* "
				+ "from events_results winners "
				+ "where winners.catId = er.catId and er.sessionName = winners.sessionName "
				+ "and winners.finalPos < er.finalPos) and er.editionId = ?";
		return jdbcTemplate.query(query, new Object[] {eventEditionId},
				(rs, rowNum) -> new Object[] {rs.getLong("entryId"), rs.getString("catName"), rs.getString("sessionName")});
	}
	
	public Map<Long, List<Object[]>> getDriversResultsInSeries(Long seriesId) {
		List<Object[]> results = jdbcTemplate.query("SELECT driverId, finalPos, times FROM DRIVER_RESULTS WHERE seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new Object[] {rs.getLong("driverId"), rs.getInt("finalPos"), rs.getInt("times")});
		
		Map<Long, List<Object[]>> result = new HashMap<Long, List<Object[]>>();
		for(Object[] tmp : results) {
			Long driverId = (Long)tmp[0];
			List<Object[]> positions = null;
			if (result.containsKey(driverId)) {
				positions = result.get(driverId);
			} else {
				positions = new ArrayList<>();
			}
			positions.add(new Object[] {tmp[1], tmp[2]});
			result.put(driverId, positions);
		}
		
		return result;
	}
	
	public Map<Long, List<Object[]>> getTeamsResultsInSeries(Long seriesId) {
		List<Object[]> results = jdbcTemplate.query("SELECT teamId, finalPos, times FROM TEAM_RESULTS WHERE seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new Object[] {rs.getLong("teamId"), rs.getInt("finalPos"), rs.getInt("times")});
		
		Map<Long, List<Object[]>> result = new HashMap<Long, List<Object[]>>();
		for(Object[] tmp : results) {
			Long teamId = (Long)tmp[0];
			List<Object[]> positions = null;
			if (result.containsKey(teamId)) {
				positions = result.get(teamId);
			} else {
				positions = new ArrayList<>();
			}
			positions.add(new Object[] {tmp[1], tmp[2]});
			result.put(teamId, positions);
		}
		
		return result;
	}
	
	public List<DriverPointsDTO> getDriversStandings(Long seriesId) {
		List<Object[]> result = jdbcTemplate.query("select ds.driverId, ds.driverName, coalesce(dcs.points, 0) points "
				+ "from drivers_series ds left join drivers_classification_series dcs on ds.driverId = dcs.driverId "
				+ "where ds.seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new Object[] {rs.getLong("driverId"), rs.getString("driverName"), rs.getFloat("points")});
		
		List<DriverPointsDTO> standings = new ArrayList<>();
		for(Object[] tmp : result) {
			DriverPointsDTO dto = new DriverPointsDTO((Long)tmp[0], (String)tmp[1], (Float)tmp[2]);
			standings.add(dto);
		}
		
		return standings;
	}
	
	public List<TeamPointsDTO> getTeamsStandings(Long seriesId) {
		List<Object[]> result = jdbcTemplate.query("select ts.teamId, ts.teamName, coalesce(tcs.points, 0) points "
				+ "from teams_series ts left join teams_classification_series tcs on ts.teamId = tcs.teamId "
				+ "where ts.seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new Object[] {rs.getLong("teamId"), rs.getString("teamName"), rs.getFloat("points")});
		
		List<TeamPointsDTO> standings = new ArrayList<>();
		for(Object[] tmp : result) {
			TeamPointsDTO dto = new TeamPointsDTO((Long)tmp[0], (String)tmp[1], (Float)tmp[2]);
			standings.add(dto);
		}
		
		return standings;
	}
}

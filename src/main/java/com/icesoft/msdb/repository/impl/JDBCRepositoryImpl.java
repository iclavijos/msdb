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
		String query = "select entryId, catName, sessionName, min(finalPos) finalPos "
				+ "from events_results "
				+ "where editionId = ? "
				+ "group by catName, sessionName "
				+ "order by sessionStartTime";
		return jdbcTemplate.query(query, new Object[] {eventEditionId},
				(rs, rowNum) -> new Object[] {rs.getLong("entryId"), rs.getString("catName"), rs.getString("sessionName"), rs.getInt("finalPos")});
	}
	
	public Map<Long, List<Object[]>> getDriversResultsInSeries(Long seriesId) {
		List<Object[]> results = jdbcTemplate.query("SELECT driverId, finalPos, times FROM driver_results WHERE seriesId = ?", 
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
		List<Object[]> results = jdbcTemplate.query("SELECT teamId, finalPos, times FROM team_results WHERE seriesId = ?", 
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
		
		List<DriverPointsDTO> result = jdbcTemplate.query("select ds.driverId, ds.driverName, coalesce(dcs.points, 0) points "
				+ "from drivers_series ds left outer join drivers_classification_series dcs on ds.driverId = dcs.driverId and ds.seriesId = dcs.seriesId "
				+ "where ds.seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new DriverPointsDTO(rs.getLong("driverId"), rs.getString("driverName"), rs.getFloat("points")));
		
		return result;
	}
	
	public List<TeamPointsDTO> getTeamsStandings(Long seriesId) {
		List<TeamPointsDTO> result = jdbcTemplate.query("select ts.teamId, ts.teamName, coalesce(tcs.points, 0) points "
				+ "from teams_series ts left join teams_classification_series tcs on ts.teamId = tcs.teamId and ts.seriesId = tcs.series_edition_id  "
				+ "where ts.seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new TeamPointsDTO(rs.getLong("teamId"), rs.getString("teamName"), rs.getFloat("points")));
		
		return result;
	}
}

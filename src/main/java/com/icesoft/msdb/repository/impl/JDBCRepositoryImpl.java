package com.icesoft.msdb.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.icesoft.msdb.service.dto.DriverPointsDTO;
import com.icesoft.msdb.service.dto.ManufacturerPointsDTO;
import com.icesoft.msdb.service.dto.TeamPointsDTO;

@Repository
public class JDBCRepositoryImpl {

	@Autowired private JdbcTemplate jdbcTemplate;
	
	public List<Object[]> getEventWinners(Long eventEditionId) {
		//This needs to be improved to solve it just with a query
		String query = "select entryId, catName, sessionName, finalPos "
				+ "from events_results "
				+ "where editionId = ? "
				+ "order by sessionStartTime asc, finalPos asc";
		List<Object[]> tmp = jdbcTemplate.query(query, new Object[] {eventEditionId},
				(rs, rowNum) -> new Object[] {rs.getLong("entryId"), rs.getString("catName"), rs.getString("sessionName"), rs.getInt("finalPos")});
		
		List<String> categories = tmp.parallelStream().map(o -> o[1].toString()).distinct().collect(Collectors.toList());
		List<String> sessions = tmp.parallelStream().map(o -> o[2].toString()).distinct().collect(Collectors.toList());
		
		List<Object[]> result = new ArrayList<>();
		for(String session: sessions) {
			for(String category: categories) {
				result.add(tmp.parallelStream()
						.filter(o -> o[2].toString().equals(session))
						.filter(o -> o[1].toString().equals(category)).findFirst().get());
			}
		}
		
		return result;
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
				new Object[] {seriesId}, (rs, rowNum) -> new DriverPointsDTO(null, rs.getLong("driverId"), rs.getString("driverName"), rs.getFloat("points")));
		
		return result;
	}
	
	public List<TeamPointsDTO> getTeamsStandings(Long seriesId) {
		List<TeamPointsDTO> result = jdbcTemplate.query("select ts.teamId, ts.teamName, coalesce(tcs.points, 0) points "
				+ "from teams_series ts left join teams_classification_series tcs on ts.teamId = tcs.teamId and ts.seriesId = tcs.series_edition_id  "
				+ "where ts.seriesId = ?", 
				new Object[] {seriesId}, (rs, rowNum) -> new TeamPointsDTO(rs.getLong("teamId"), rs.getString("teamName"), rs.getFloat("points")));
		
		return result;
	}
	
	public List<ManufacturerPointsDTO> getManufacturersStandings(Long seriesId) {
		List<ManufacturerPointsDTO> result = jdbcTemplate.query("select manufacturer, sum(points) points from ("
				+ "select mep.* "
				+ "from manufacturer_event_points mep left join event_session es on mep.session_id = es.id "
				+ "left join event_edition ee on es.event_edition_id = ee.id "
				+ "where ee.series_edition_id = ?) tmp "
				+ "group by manufacturer "
				+ "order by points desc", 
				new Object[] {seriesId}, (rs, rowNum) -> new ManufacturerPointsDTO(rs.getString("manufacturer"), rs.getFloat("points")));
		
		return result;
	}
	
//	public EventsSeriesNavigationDTO getNavigation(Long eventEditionId) {
//		List<EventsSeriesNavigationDTO> result = jdbcTemplate.query(
//				"SELECT "
//				+ "pe2.id prev_id, pe2.long_event_name prev_name, ne2.id next_id, ne2.long_event_name next_name "
//				+ "FROM event_edition pe1 "
//				+ "LEFT JOIN event_edition pe2 ON pe1.series_edition_id = pe2.series_edition_id AND pe1.event_date > pe2.event_date "
//				+ "LEFT JOIN event_edition pe3 ON pe1.series_edition_id = pe3.series_edition_id AND pe1.event_date > pe3.event_date AND pe3.event_date > pe2.event_date, "
//				+ "event_edition ne1 "
//				+ "LEFT JOIN event_edition ne2 ON ne1.series_edition_id = ne2.series_edition_id AND ne1.event_date < ne2.event_date "
//				+ "LEFT JOIN event_edition ne3 ON ne1.series_edition_id = ne3.series_edition_id AND ne1.event_date < ne3.event_date AND ne3.event_date < ne2.event_date "
//				+ "WHERE pe1.id = ? and pe3.id is null and ne1.id = pe1.id and ne3.id is null",
//				new Object[] { eventEditionId },
//				(rs, rowNum) -> new EventsSeriesNavigationDTO(rs.getInt("prev_id"), rs.getInt("next_id"), rs.getString("prev_name"), rs.getString("next_name")));
//		
//		//We will only retrieve one record
//		return result.get(0);
//	}
}

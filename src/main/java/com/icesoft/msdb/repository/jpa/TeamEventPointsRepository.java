package com.icesoft.msdb.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.TeamEventPoints;

import java.util.List;

@Repository
public interface TeamEventPointsRepository extends JpaRepository<TeamEventPoints,Long> {

	@Modifying
	@Query("DELETE FROM TeamEventPoints tep WHERE tep.session.id = ?1 and tep.seriesEdition.id = ?2")
	@Transactional
	void deleteSessionPoints(Long sessionId, Long seriesEditionId);

    @Query("SELECT tep.team.id, tep.team.name, sum(points) as points, count(*) as num_points "
        + "FROM TeamEventPoints tep "
        + "WHERE tep.points <> 0 AND tep.session.eventEdition.id = ?1 "
        + "GROUP BY tep.team.id "
        + "ORDER BY points desc")
    List<Object[]> getTeamsPointsInEvent(Long eventEditionId);

    @Query("SELECT tep.team.id, tep.team.name, sum(points) as points, count(*) as num_points "
        + "FROM TeamEventPoints tep "
        + "WHERE tep.points <> 0 AND tep.seriesEdition.id = ?1 and tep.session.eventEdition.id = ?2 "
        + "GROUP BY tep.team.id "
        + "ORDER BY points desc")
    List<Object[]> getTeamsPointsInEvent(Long seriesId, Long eventEditionId);

    @Query("SELECT tep.id, tep.team.name, tep.points, tep.reason "
        + "FROM TeamEventPoints tep "
        + "WHERE tep.points <> 0 AND tep.session.eventEdition.id = ?1 AND tep.team.id = ?2 "
        + "ORDER BY tep.session.sessionStartTime desc, tep.points desc")
    List<Object[]> getTeamPointsInEvent(Long eventEditionId, Long teamId);
}

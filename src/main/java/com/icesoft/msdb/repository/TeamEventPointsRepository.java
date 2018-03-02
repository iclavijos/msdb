package com.icesoft.msdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.TeamEventPoints;

@Repository
public interface TeamEventPointsRepository extends JpaRepository<TeamEventPoints,Long> {

	@Modifying
	@Query("DELETE FROM TeamEventPoints tep WHERE tep.session.id = ?1 and tep.seriesEdition.id = ?2")
	@Transactional
	void deleteSessionPoints(Long sessionId, Long seriesEditionId);

}

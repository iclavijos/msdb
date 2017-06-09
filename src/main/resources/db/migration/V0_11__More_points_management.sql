create or replace view drivers_classification_series as
select d.id driverId, concat(d.name, ' ', d.surname) driverName, sum(points) points, series_edition_id seriesId
from driver_event_points dep, event_session es, event_edition ee, driver d
where dep.session_id = es.id and es.event_edition_id = ee.id and dep.driver_id = d.id
group by driver_id, series_edition_id
order by points desc;

create or replace view teams_classification_series as
SELECT t.id as teamId, t.name AS teamName,
        SUM(tep.points) AS points,
        ee.series_edition_id AS series_edition_id
FROM
	team_event_points tep JOIN event_session es	JOIN event_edition ee JOIN team t
WHERE
	tep.session_id = es.id AND es.event_edition_id = ee.id
		AND tep.team_id = t.id
GROUP BY tep.team_id , ee.series_edition_id;

CREATE or replace VIEW drivers_series AS
select d.id driverId, concat(d.name, ' ', d.surname) driverName, se.id seriesId
from driver d, series_edition se, event_edition ee, event_entry en, drivers_entry de
where ee.series_edition_id = se.id and en.event_edition_id = ee.id and de.entry_id = en.id and de.driver_id = d.id
group by d.id, se.id;

create or replace view teams_series as
select t.id teamId, t.name teamName, s.id seriesId
from team t, series_edition s, event_entry en, event_edition ee
where en.team_id = t.id and en.event_edition_id = ee.id and ee.series_edition_id = s.id
group by teamId, seriesId

create or replace view driver_results as
select d.id driverId, eer.final_position finalPos, count(*) times, se.id seriesId
from driver d, series_edition se, event_edition ee, event_entry en, drivers_entry de, event_entry_result eer, event_session es
where eer.entry_id = en.id and eer.session_id = es.id and es.session_type = 2 and de.entry_id = en.id
and de.driver_id = d.id and es.event_edition_id = ee.id and ee.series_edition_id = se.id and eer.final_position < 900
group by driverId, finalPos;

create or replace view team_results as
SELECT 
        t.id as teamId,
        eer.final_position AS finalPos,
        COUNT(0) AS times,
        se.id AS seriesId
    FROM
        team t
        JOIN series_edition se
        JOIN event_edition ee
        JOIN event_entry en
        JOIN event_entry_result eer
        JOIN event_session es
    WHERE
        ((eer.entry_id = en.id)
			AND en.team_id = t.id
            AND (eer.session_id = es.id)
            AND (es.session_type = 2)
            AND (es.event_edition_id = ee.id)
            AND (ee.series_edition_id = se.id)
            AND (eer.final_position < 900))
    GROUP BY teamId , finalPos;
    
create or replace view events_results as
select ed.id editionId, ee.id entryId, ee.team_name teamName, c.id catId, c.shortname catName, es.name sessionName, eer.final_position finalPos
from event_entry_result eer, event_session es, event_entry ee, event_edition ed, categories_event ce, category c
where eer.session_id = es.id and es.session_type = 2 and ee.id = eer.entry_id and ed.id = es.event_edition_id and ce.event_edition_id = ed.id and ce.category_id = c.id
order by es.session_start_time ASC;
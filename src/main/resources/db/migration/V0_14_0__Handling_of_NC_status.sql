create or replace view driver_results as
select d.id driverId, eer.final_position finalPos, count(*) times, se.id seriesId
from driver d, series_edition se, event_edition ee, event_entry en, drivers_entry de, event_entry_result eer, event_session es
where eer.entry_id = en.id and eer.session_id = es.id and es.session_type = 2 and de.entry_id = en.id
and de.driver_id = d.id and es.event_edition_id = ee.id and ee.series_edition_id = se.id and eer.final_position < 800
group by driverId, finalPos;
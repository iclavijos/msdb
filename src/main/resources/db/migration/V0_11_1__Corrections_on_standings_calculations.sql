alter table msdb.series_edition add column drivers_standings bit;
alter table msdb.series_edition add column manufacturers_standings bit;
alter table msdb.series_edition add column teams_standings bit;

alter table msdb.event_session add column ps_multiplier float;

UPDATE msdb.event_entry SET event_edition_id='24' WHERE id='24';
UPDATE msdb.event_entry SET event_edition_id='25' WHERE id='63';
UPDATE msdb.event_entry SET event_edition_id='26' WHERE id='85';
UPDATE msdb.event_entry SET event_edition_id='30' WHERE id='124';
UPDATE msdb.event_entry SET event_edition_id='32' WHERE id='146';
UPDATE msdb.event_entry SET event_edition_id='32' WHERE id='151';
UPDATE msdb.event_entry SET event_edition_id='27' WHERE id='172';
UPDATE msdb.event_entry SET event_edition_id='35' WHERE id='223';

CREATE OR REPLACE
VIEW events_results AS
    select 
        ed.id AS editionId,
        ee.id AS entryId,
        ee.team_name AS teamName,
        c.id AS catId,
        c.shortname AS catName,
        es.name AS sessionName,
        eer.final_position AS finalPos,
        es.session_start_time AS sessionStartTime
    from
        ((((event_entry_result eer
        join event_entry ee)
        join event_session es)
        join event_edition ed)
        join category c)
    where
        ((eer.session_id = es.id)
            and (es.event_edition_id = ed.id)
            and (es.session_type = 2)
            and (eer.entry_id = ee.id)
            and (ee.category_id = c.id))
    order by es.session_start_time;

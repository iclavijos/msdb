ALTER TABLE event_session
ADD COLUMN start_time TIMESTAMP NULL AFTER start_time_ts;

UPDATE event_session
SET start_time = from_unixtime(start_time_ts)
WHERE start_time_ts <> 0;

ALTER TABLE event_session
DROP COLUMN start_time_ts;

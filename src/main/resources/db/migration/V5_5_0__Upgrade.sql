ALTER TABLE category
ADD COLUMN category_front_color VARCHAR(8) NULL DEFAULT '#000000' AFTER category_color;

ALTER TABLE event_session
CHANGE COLUMN duration_type duration_type VARCHAR(20) NULL DEFAULT NULL,
CHANGE COLUMN session_type session_type VARCHAR(20) NULL DEFAULT NULL;

UPDATE event_session SET session_type = 'PRACTICE' where session_type = '0';
UPDATE event_session SET session_type = 'QUALIFYING' where session_type = '1';
UPDATE event_session SET session_type = 'RACE' where session_type = '2';
UPDATE event_session SET session_type = 'QUALIFYING_RACE' where session_type = '3';
UPDATE event_session SET session_type = 'STAGE' where session_type = '4';

UPDATE event_session SET duration_type = 'MINUTES' where duration_type = '1';
UPDATE event_session SET duration_type = 'HOURS' where duration_type = '2';
UPDATE event_session SET duration_type = 'KMS' where duration_type = '3';
UPDATE event_session SET duration_type = 'MILES' where duration_type = '4';
UPDATE event_session SET duration_type = 'LAPS' where duration_type = '5';

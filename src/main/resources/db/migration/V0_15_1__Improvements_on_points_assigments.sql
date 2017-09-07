ALTER TABLE msdb.series_edition ADD COLUMN num_events TINYINT NOT NULL AFTER teams_standings;

ALTER TABLE msdb.driver_event_points ADD COLUMN reason VARCHAR(150) NULL DEFAULT NULL AFTER session_id;

UPDATE `msdb`.`points_system` SET `minimum_finishing_pos`='10', `pitlane_start_allowed`=0 WHERE `id`='5';
UPDATE `msdb`.`points_system` SET `minimum_finishing_pos`='10', `pitlane_start_allowed`=0 WHERE `id`='6';
UPDATE `msdb`.`points_system` SET `pitlane_start_allowed`=0 WHERE `id`='1';
UPDATE `msdb`.`points_system` SET `pitlane_start_allowed`=0 WHERE `id`='2';
UPDATE `msdb`.`points_system` SET `pitlane_start_allowed`=0 WHERE `id`='3';
UPDATE `msdb`.`points_system` SET `pitlane_start_allowed`=0 WHERE `id`='4';
UPDATE `msdb`.`points_system` SET `pitlane_start_allowed`=0 WHERE `id`='7';

UPDATE `msdb`.`event_session` SET `points_system_id`='1', `ps_multiplier`='2' WHERE `id`='57';
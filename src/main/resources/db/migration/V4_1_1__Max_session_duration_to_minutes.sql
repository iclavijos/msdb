update event_session
set max_duration = max_duration * 60
where max_duration is not null;

ALTER TABLE `msdb`.`points_system`
ADD COLUMN `always_assign_fl` TINYINT(4) NULL DEFAULT '1' AFTER `pitlane_start_allowed`;


ALTER TABLE `msdb`.`team_event_points`
ADD COLUMN `reason` VARCHAR(150) NULL DEFAULT NULL AFTER `category_id`;

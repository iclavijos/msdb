ALTER TABLE `msdb`.`points_system` 
CHANGE COLUMN `pct_completed` `pct_completed_fl` TINYINT(4) NULL DEFAULT '0' ,
CHANGE COLUMN `minimum_finishing_pos` `max_pos_fast_lap` TINYINT(4) NULL DEFAULT '0' ,
ADD COLUMN `points_systemcol` VARCHAR(45) NULL AFTER `last_modified_date`,
ADD COLUMN `race_pct_completed_total_points` TINYINT NULL AFTER `points_systemcol`,
ADD COLUMN `pct_total_points` TINYINT NULL AFTER `race_pct_completed_total_points`;

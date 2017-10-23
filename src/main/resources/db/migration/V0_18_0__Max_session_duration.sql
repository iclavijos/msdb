ALTER TABLE event_session ADD COLUMN max_duration INT(11) NULL;

ALTER TABLE `msdb`.`event_entry_result` 
ADD COLUMN `shared_drive_with_id` BIGINT(20) NULL AFTER `pitlane_start`,
ADD INDEX `FKShared_drive_idx` (`shared_drive_with_id` ASC);
ALTER TABLE `msdb`.`event_entry_result` 
ADD CONSTRAINT `FKShared_drive`
  FOREIGN KEY (`shared_drive_with_id`)
  REFERENCES `msdb`.`event_entry` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
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
  
ALTER TABLE `msdb`.`event_entry` 
DROP FOREIGN KEY `FK4adbjy4sbwmfs4iyqqmrqg0ps`;
ALTER TABLE `msdb`.`event_entry` 
CHANGE COLUMN `team_id` `team_id` BIGINT(20) NULL ;
ALTER TABLE `msdb`.`event_entry` 
ADD CONSTRAINT `FK4adbjy4sbwmfs4iyqqmrqg0ps`
  FOREIGN KEY (`team_id`)
  REFERENCES `msdb`.`team` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
ALTER TABLE `msdb`.`event_entry` 
DROP FOREIGN KEY `FK997ond7rql17a9gbgo0ffdcax`;
ALTER TABLE `msdb`.`event_entry` 
CHANGE COLUMN `engine_id` `engine_id` BIGINT(20) NULL ;
ALTER TABLE `msdb`.`event_entry` 
ADD CONSTRAINT `FK997ond7rql17a9gbgo0ffdcax`
  FOREIGN KEY (`engine_id`)
  REFERENCES `msdb`.`engine` (`id`);
  
alter table msdb.series_event add column event_id bigint not null;
alter table msdb.series_event add column series_id bigint not null;
alter table series_event add constraint FKd1yq7kb6sx62mx6wop92kay37 foreign key (series_id) references series_edition (id);
alter table series_event add constraint FK7pvny5k5vlge97x7fda2ey720 foreign key (event_id) references event_edition (id);

ALTER TABLE `msdb`.`series_event` 
DROP FOREIGN KEY `FK_series_id_series_event`,
DROP FOREIGN KEY `FK_event_id_series_event`;
ALTER TABLE `msdb`.`series_event` 
DROP COLUMN `series_edition_id`,
DROP COLUMN `event_edition_id`,
DROP INDEX `FK_event_id_series_event` ,
DROP INDEX `FK_series_id_series_event` ;
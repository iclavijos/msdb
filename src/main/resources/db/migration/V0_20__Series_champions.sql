CREATE TABLE `msdb`.`series_drivers_champions` (
  `driver_id` BIGINT(20) NULL,
  `series_edition_id` BIGINT(20) NULL,
  INDEX `fk_driver_champion_idx` (`driver_id` ASC),
  INDEX `fk_series_edition_champions_idx` (`series_edition_id` ASC),
  CONSTRAINT `fk_driver_champion`
    FOREIGN KEY (`driver_id`)
    REFERENCES `msdb`.`driver` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_series_edition_champions`
    FOREIGN KEY (`series_edition_id`)
    REFERENCES `msdb`.`series_edition` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
ALTER TABLE `msdb`.`series_edition` 
ADD COLUMN `team_champion_id` BIGINT(20) NULL AFTER `multidriver`,
ADD INDEX `fk_team_champion_idx` (`team_champion_id` ASC);
ALTER TABLE `msdb`.`series_edition` 
ADD CONSTRAINT `fk_team_champion`
  FOREIGN KEY (`team_champion_id`)
  REFERENCES `msdb`.`team` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

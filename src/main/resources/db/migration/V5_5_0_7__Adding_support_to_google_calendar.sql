ALTER TABLE series_edition
ADD COLUMN calendar_id VARCHAR(100);

CREATE TABLE `calendar_session` (
  `series_edition_id` BIGINT(20) NOT NULL,
  `session_id` BIGINT(20) NOT NULL,
  `calendar_id` VARCHAR(100) NULL,
  PRIMARY KEY (`series_edition_id`, `session_id`),
  INDEX `fk_calsess_series_edition_idx` (`series_edition_id` ASC),
  INDEX `fk_calsess_session_idx` (`session_id` ASC),
  CONSTRAINT `fk_calsess_series_edition`
    FOREIGN KEY (`series_edition_id`)
    REFERENCES `msdb`.`series_edition` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_calsess_session`
    FOREIGN KEY (`session_id`)
    REFERENCES `msdb`.`event_session` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

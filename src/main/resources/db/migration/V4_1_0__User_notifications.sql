CREATE TABLE `user_suscription` (
  `user_id` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL,
  `series_edition_id` BIGINT(20) NOT NULL,
  `practice_sessions` BIT(1) NULL,
  `quali_sessions` BIT(1) NULL,
  `races` BIT(1) NULL,
  `15m_warning` BIT(1) NULL,
  `1h_warning` BIT(1) NULL,
  `3h_warning` BIT(1) NULL,
  PRIMARY KEY (`user_id`, `series_edition_id`),
  INDEX `fk_series_suscription_idx` (`user_id` ASC, `series_edition_id` ASC) VISIBLE,
  CONSTRAINT `fk_series_suscription`
    FOREIGN KEY (`series_edition_id`)
    REFERENCES `msdb`.`series_edition` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_suscription`
    FOREIGN KEY (`user_id`)
    REFERENCES `jhi_user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

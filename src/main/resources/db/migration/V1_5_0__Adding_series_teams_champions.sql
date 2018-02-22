ALTER TABLE `msdb`.`series_edition` 
DROP FOREIGN KEY `fk_team_champion`;
ALTER TABLE `msdb`.`series_edition` 
DROP COLUMN `team_champion_id`,
DROP INDEX `fk_team_champion_idx` ;

CREATE TABLE `series_teams_champions` (
  `team_id` bigint(20) DEFAULT NULL,
  `series_edition_id` bigint(20) DEFAULT NULL,
  KEY `fk_team_champion_idx` (`team_id`),
  KEY `fk_series_edition_tchampions_idx` (`series_edition_id`),
  CONSTRAINT `fk_team_champion` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_series_edition_tchampions` FOREIGN KEY (`series_edition_id`) REFERENCES `series_edition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
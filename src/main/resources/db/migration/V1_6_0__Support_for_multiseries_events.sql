insert into series_event (select id, series_edition_id from event_edition where series_edition_id is not null);

ALTER TABLE `event_edition` 
DROP FOREIGN KEY `FKooj5xlejevfm8dyfrodd4vn8g`;
ALTER TABLE `event_edition` 
DROP COLUMN `series_edition_id`,
DROP INDEX `FKooj5xlejevfm8dyfrodd4vn8g` ;

ALTER TABLE `series_event` RENAME TO `events_series` ;

CREATE TABLE `points_system_session` (
  `points_system_id` BIGINT(20) NOT NULL,
  `series_edition_id` BIGINT(20) NOT NULL,
  `session_id` BIGINT(20) NOT NULL,
  `ps_multiplier` FLOAT NULL,
  PRIMARY KEY (`points_system_id`, `series_edition_id`, `session_id`),
  INDEX `fk_pss_series_edition_idx` (`series_edition_id` ASC),
  INDEX `fk_pss_session_idx` (`session_id` ASC),
  CONSTRAINT `fk_pss_points_system`
    FOREIGN KEY (`points_system_id`)
    REFERENCES `msdb`.`points_system` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pss_series_edition`
    FOREIGN KEY (`series_edition_id`)
    REFERENCES `msdb`.`series_edition` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pss_session`
    FOREIGN KEY (`session_id`)
    REFERENCES `msdb`.`event_session` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

insert into points_system_session (select es.points_system_id, ess.series_id, es.id, es.ps_multiplier
from event_session es left join event_edition ee on es.event_edition_id = ee.id 
	left join events_series ess on ess.event_id = ee.id
where es.points_system_id is not null);

ALTER TABLE `event_session` 
DROP FOREIGN KEY `FKp794uhpkjc1errhm42lok61q5`;
ALTER TABLE `event_session` 
DROP COLUMN `ps_multiplier`,
DROP COLUMN `points_system_id`,
DROP INDEX `FKp794uhpkjc1errhm42lok61q5` ;

ALTER TABLE `points_system_session` 
DROP FOREIGN KEY `fk_pss_points_system`;
ALTER TABLE `points_system_session` 
CHANGE COLUMN `points_system_id` `points_system_id` BIGINT(20) NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`series_edition_id`, `session_id`);
ALTER TABLE `points_system_session` 
ADD CONSTRAINT `fk_pss_points_system`
  FOREIGN KEY (`points_system_id`)
  REFERENCES `points_system` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `driver_event_points` 
ADD COLUMN `series_edition_id` BIGINT(20) NULL AFTER `reason`,
ADD INDEX `FK_series_edition_dep_idx` (`series_edition_id` ASC);
ALTER TABLE `driver_event_points` 
ADD CONSTRAINT `FK_series_edition_dep`
  FOREIGN KEY (`series_edition_id`)
  REFERENCES `series_edition` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

update driver_event_points dep left join points_system_session pss on dep.session_id = pss.session_id
set dep.series_edition_id = pss.series_edition_id;

update points_system
set race_pct_completed_total_points = 0
where race_pct_completed_total_points is null;

update points_system
set pct_total_points = 100
where pct_total_points is null;

ALTER TABLE `team_event_points` 
ADD COLUMN `series_edition_id` BIGINT(20) NULL AFTER `team_id`,
ADD INDEX `FK_series_edition_tep_idx` (`series_edition_id` ASC);
ALTER TABLE `team_event_points` 
ADD CONSTRAINT `FK_series_edition_tep`
  FOREIGN KEY (`series_edition_id`)
  REFERENCES `series_edition` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

update team_event_points tep left join points_system_session pss on tep.session_id = pss.session_id
set tep.series_edition_id = pss.series_edition_id;

CREATE TABLE `manufacturer_event_points` (
  `id` BIGINT(20) NOT NULL,
  `manufacturer` VARCHAR(100) NULL,
  `session_id` BIGINT(20) NULL,
  `series_edition_id` BIGINT(20) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_mep_event_idx` (`session_id` ASC),
  INDEX `fk_mep_series_idx` (`series_edition_id` ASC),
  CONSTRAINT `fk_mep_event`
    FOREIGN KEY (`session_id`)
    REFERENCES `event_session` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mep_series`
    FOREIGN KEY (`series_edition_id`)
    REFERENCES `series_edition` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `drivers_classification_series` AS
    select 
        `d`.`id` AS `driverId`,
        concat(`d`.`name`, ' ', `d`.`surname`) AS `driverName`,
        sum(`dep`.`points`) AS `points`,
        `dep`.`series_edition_id` AS `seriesId`
    from
        ((`driver_event_points` `dep`
        join `event_session` `es`)
        join `driver` `d`)
    where
        ((`dep`.`session_id` = `es`.`id`)
            and (`dep`.`driver_id` = `d`.`id`))
    group by `dep`.`driver_id` , `dep`.`series_edition_id`
    order by sum(`dep`.`points`) desc;

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `teams_classification_series` AS
    select 
        `t`.`id` AS `teamId`,
        `t`.`name` AS `teamName`,
        sum(`tep`.`points`) AS `points`,
        `tep`.`series_edition_id` AS `series_edition_id`
    from
        ((`team_event_points` `tep`
        join `event_session` `es`)
        join `team` `t`)
    where
        ((`tep`.`session_id` = `es`.`id`)
            and (`tep`.`team_id` = `t`.`id`))
    group by `tep`.`team_id` , `tep`.`series_edition_id`;

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `msdb`@`localhost` 
    SQL SECURITY DEFINER
VIEW `driver_results` AS
    select `d`.`id` AS `driverId`,
        `eer`.`final_position` AS `finalPos`,
        count(0) AS `times`,
        evs.series_id AS `seriesId`
from 
	events_series evs
	left join event_edition ee on evs.event_id = ee.id
	left join event_session es on es.event_edition_id = ee.id
	left join event_entry en on en.event_edition_id = ee.id
	left join drivers_entry de on de.entry_id = en.id
	left join driver d on de.driver_id = d.id
	left join event_entry_result eer on eer.entry_id = en.id and eer.session_id = es.id
where `es`.`session_type` = 2 and `eer`.`final_position` < 800
group by `d`.`id` , `eer`.`final_position`;

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `drivers_series` AS
    select 
        `d`.`id` AS `driverId`,
        concat(`d`.`name`, ' ', `d`.`surname`) AS `driverName`,
        evs.series_id AS `seriesId`
from
	events_series evs left join event_edition ee on evs.event_id = ee.id
	join event_entry en on en.event_edition_id = ee.id
	join drivers_entry de on de.entry_id = en.id
	join driver d on de.driver_id = d.id
group by `d`.`id` , evs.series_id;

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `teams_series` AS
    select 
        `t`.`id` AS `teamId`,
        `t`.`name` AS `teamName`,
        evs.series_id AS `seriesId`
from
	events_series evs join event_entry en on en.event_edition_id = evs.event_id
	join team t on en.team_id = t.id
group by `t`.`id` , seriesId;

CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `team_results` AS
    select `t`.`id` AS `teamId`,
        `eer`.`final_position` AS `finalPos`,
        count(0) AS `times`,
        evs.series_id AS `seriesId`
from
	events_series evs join event_entry en on evs.event_id = en.event_edition_id
	join event_session es on es.event_edition_id = evs.event_id
	join team t on en.team_id = t.id
	join event_entry_result eer on eer.entry_id = en.id and eer.session_id = es.id
where es.session_type = 2 and eer.final_position < 800
group by `t`.`id` , `eer`.`final_position`;
ALTER TABLE series_edition ADD COLUMN standings_per_category BIT(1) NULL DEFAULT b'0';

ALTER TABLE driver_event_points
ADD COLUMN category_id BIGINT(20) NULL AFTER series_edition_id,
ADD INDEX FK_category_dep_idx (category_id ASC);
ALTER TABLE driver_event_points
ADD CONSTRAINT FK_category_dep
  FOREIGN KEY (category_id)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE team_event_points
ADD COLUMN category_id BIGINT(20) NULL AFTER series_edition_id,
ADD INDEX FK_category_tep_idx (category_id ASC);
ALTER TABLE team_event_points
ADD CONSTRAINT FK_category_tep
  FOREIGN KEY (category_id)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE manufacturer_event_points
ADD COLUMN category_id BIGINT(20) NULL AFTER points,
ADD INDEX fk_category_mep_idx (category_id ASC);
ALTER TABLE manufacturer_event_points
ADD CONSTRAINT fk_category_mep
  FOREIGN KEY (category_id)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE
     OR REPLACE ALGORITHM = UNDEFINED
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `drivers_classification_series` AS
    SELECT
        `d`.`id` AS `driverId`,
        CONCAT(`d`.`name`, ' ', `d`.`surname`) AS `driverName`,
        SUM(`dep`.`points`) AS `points`,
        `dep`.`series_edition_id` AS `seriesId`,
        `c`.`shortname` AS `category`
    FROM
        (((`driver_event_points` `dep`
        JOIN `event_session` `es`)
        JOIN `driver` `d`)
        LEFT JOIN `category` `c` ON ((`dep`.`category_id` = `c`.`id`)))
    WHERE
        ((`dep`.`session_id` = `es`.`id`)
            AND (`dep`.`driver_id` = `d`.`id`))
    GROUP BY `dep`.`driver_id` , `dep`.`series_edition_id`, dep.category_id
    ORDER BY SUM(`dep`.`points`) DESC;

CREATE
     OR REPLACE ALGORITHM = UNDEFINED
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `teams_classification_series` AS
    SELECT
        `t`.`id` AS `teamId`,
        `t`.`name` AS `teamName`,
        SUM(`tep`.`points`) AS `points`,
        `tep`.`series_edition_id` AS `series_edition_id`,
        `c`.`shortname` AS `category`
    FROM
        (((`team_event_points` `tep`
        JOIN `event_session` `es`)
        JOIN `team` `t`)
        LEFT JOIN `category` `c` ON ((`tep`.`category_id` = `c`.`id`)))
    WHERE
        ((`tep`.`session_id` = `es`.`id`)
            AND (`tep`.`team_id` = `t`.`id`))
    GROUP BY `tep`.`team_id` , `tep`.`series_edition_id`, tep.category_id;

DROP VIEW drivers_series;
DROP VIEW teams_series;

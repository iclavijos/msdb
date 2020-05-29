/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

create or replace view `team_results` AS
SELECT
  `t`.`id` AS `teamId`,
  `eer`.`final_position` AS `finalPos`,
  COUNT(0) AS `times`,
  `evs`.`series_id` AS `seriesId`
FROM
  ((((`events_series` `evs`
  JOIN `event_entry` `en` ON ((`evs`.`event_id` = `en`.`event_edition_id`)))
  JOIN `event_session` `es` ON ((`es`.`event_edition_id` = `evs`.`event_id`)))
  JOIN `team` `t` ON ((`en`.`team_id` = `t`.`id`)))
  JOIN `event_entry_result` `eer` ON (((`eer`.`entry_id` = `en`.`id`)
      AND (`eer`.`session_id` = `es`.`id`))))
WHERE
  ((`es`.`session_type` = 2)
      AND (`eer`.`final_position` < 800))
GROUP BY `t`.`id` , `eer`.`final_position` , `evs`.`series_id`;

CREATE OR REPLACE VIEW `driver_results` AS
SELECT
   `d`.`id` AS `driverId`,
   `eer`.`final_position` AS `finalPos`,
   COUNT(0) AS `times`,
   `evs`.`series_id` AS `seriesId`
FROM
   ((((((`events_series` `evs`
   LEFT JOIN `event_edition` `ee` ON ((`evs`.`event_id` = `ee`.`id`)))
   LEFT JOIN `event_session` `es` ON ((`es`.`event_edition_id` = `ee`.`id`)))
   LEFT JOIN `event_entry` `en` ON ((`en`.`event_edition_id` = `ee`.`id`)))
   LEFT JOIN `drivers_entry` `de` ON ((`de`.`entry_id` = `en`.`id`)))
   LEFT JOIN `driver` `d` ON ((`de`.`driver_id` = `d`.`id`)))
   LEFT JOIN `event_entry_result` `eer` ON (((`eer`.`entry_id` = `en`.`id`)
       AND (`eer`.`session_id` = `es`.`id`))))
WHERE
   ((`es`.`session_type` = 2)
       AND (`eer`.`final_position` < 800))
GROUP BY `d`.`id` , `eer`.`final_position` , `evs`.`series_id`;

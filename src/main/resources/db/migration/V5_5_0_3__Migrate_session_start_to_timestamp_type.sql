ALTER TABLE event_session
ADD COLUMN start_time TIMESTAMP NULL AFTER start_time_ts;

UPDATE event_session
SET start_time = from_unixtime(start_time_ts)
WHERE start_time_ts <> 0;

ALTER TABLE event_session
DROP COLUMN start_time_ts;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED
    DEFINER = `msdb`@`localhost`
    SQL SECURITY DEFINER
VIEW `events_results` AS
    SELECT
        `ed`.`id` AS `editionId`,
        `ee`.`id` AS `entryId`,
        `ee`.`team_name` AS `teamName`,
        `c`.`id` AS `catId`,
        `c`.`shortname` AS `catName`,
        `es`.`name` AS `sessionName`,
        `eer`.`final_position` AS `finalPos`,
        `es`.`start_time` AS `sessionStartTime`
    FROM
        ((((`event_entry_result` `eer`
        JOIN `event_entry` `ee`)
        JOIN `event_session` `es`)
        JOIN `event_edition` `ed`)
        JOIN `category` `c`)
    WHERE
        `eer`.`session_id` = `es`.`id`
            AND `es`.`event_edition_id` = `ed`.`id`
            AND (`es`.`session_type` = 'race'
            OR `es`.`session_type` = 'qualifyingRace')
            AND `eer`.`entry_id` = `ee`.`id`
            AND `ee`.`category_id` = `c`.`id`
    ORDER BY `es`.`start_time`

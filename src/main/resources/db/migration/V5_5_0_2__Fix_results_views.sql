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
        `es`.`start_time_ts` AS `sessionStartTime`
    FROM
        ((((`event_entry_result` `eer`
        JOIN `event_entry` `ee`)
        JOIN `event_session` `es`)
        JOIN `event_edition` `ed`)
        JOIN `category` `c`)
    WHERE
        `eer`.`session_id` = `es`.`id`
            AND `es`.`event_edition_id` = `ed`.`id`
            AND (`es`.`session_type` = 'race' OR `es`.`session_type` = 'qualifyingRace')
            AND `eer`.`entry_id` = `ee`.`id`
            AND `ee`.`category_id` = `c`.`id`
    ORDER BY `es`.`start_time_ts`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED
    DEFINER = `msdb`@`localhost`
    SQL SECURITY DEFINER
VIEW `team_results` AS
    SELECT
        `t`.`id` AS `teamId`,
        `eer`.`final_position` AS `finalPos`,
        COUNT(0) AS `times`,
        `evs`.`series_id` AS `seriesId`
    FROM
        ((((`events_series` `evs`
        JOIN `event_entry` `en` ON (`evs`.`event_id` = `en`.`event_edition_id`))
        JOIN `event_session` `es` ON (`es`.`event_edition_id` = `evs`.`event_id`))
        JOIN `team` `t` ON (`en`.`team_id` = `t`.`id`))
        JOIN `event_entry_result` `eer` ON (`eer`.`entry_id` = `en`.`id`
            AND `eer`.`session_id` = `es`.`id`))
    WHERE
        (`es`.`session_type` = 'race'
            OR `es`.`session_type` = 'qualifyingRace')
            AND `eer`.`final_position` < 800
    GROUP BY `t`.`id` , `eer`.`final_position` , `evs`.`series_id`;

CREATE OR REPLACE
    ALGORITHM = UNDEFINED
    DEFINER = `msdb`@`localhost`
    SQL SECURITY DEFINER
VIEW `driver_results` AS
    SELECT
        `d`.`id` AS `driverId`,
        `eer`.`final_position` AS `finalPos`,
        COUNT(0) AS `times`,
        `evs`.`series_id` AS `seriesId`
    FROM
        ((((((`events_series` `evs`
        LEFT JOIN `event_edition` `ee` ON (`evs`.`event_id` = `ee`.`id`))
        LEFT JOIN `event_session` `es` ON (`es`.`event_edition_id` = `ee`.`id`))
        LEFT JOIN `event_entry` `en` ON (`en`.`event_edition_id` = `ee`.`id`))
        LEFT JOIN `drivers_entry` `de` ON (`de`.`entry_id` = `en`.`id`))
        LEFT JOIN `driver` `d` ON (`de`.`driver_id` = `d`.`id`))
        LEFT JOIN `event_entry_result` `eer` ON (`eer`.`entry_id` = `en`.`id`
            AND `eer`.`session_id` = `es`.`id`))
    WHERE
        (`es`.`session_type` = 'race' OR `es`.`session_type` = 'qualifyingRace')
            AND `eer`.`final_position` < 800
    GROUP BY `d`.`id` , `eer`.`final_position` , `evs`.`series_id`;

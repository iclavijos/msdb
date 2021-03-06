/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `jhi_social_user_connection`;

ALTER TABLE `jhi_persistent_audit_evt_data`
DROP FOREIGN KEY `FK2ehnyx2si4tjd2nt4q7y40v8m`;

TRUNCATE `jhi_persistent_audit_event`;
TRUNCATE `jhi_persistent_audit_evt_data`;
TRUNCATE `jhi_user_authority`;
TRUNCATE `jhi_user`;

ALTER TABLE `jhi_user_authority`
DROP FOREIGN KEY `fk_user_id`;
ALTER TABLE `jhi_user_authority`
DROP FOREIGN KEY `FK290okww5jujghp4el5i7mgwu0`;

ALTER TABLE `jhi_user`
CHANGE COLUMN `id` `id` VARCHAR(20) NOT NULL ;

ALTER TABLE `jhi_user_authority`
CHANGE COLUMN `user_id` `user_id` VARCHAR(20) NOT NULL ;

ALTER TABLE `jhi_user_authority`
ADD CONSTRAINT `fk_user_id`
FOREIGN KEY (`user_id`)
REFERENCES `jhi_user` (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `event_edition`
ADD COLUMN `poster_url` VARCHAR(150) NULL,
ADD COLUMN `status` VARCHAR(1) NOT NULL DEFAULT 'O';

UPDATE event_session
SET start_time_ts = UNIX_TIMESTAMP(session_start_time);

ALTER TABLE event_session
drop column session_start_time;

create or replace view `events_results` AS
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
        ((`eer`.`session_id` = `es`.`id`)
            AND (`es`.`event_edition_id` = `ed`.`id`)
            AND (`es`.`session_type` = 2)
            AND (`eer`.`entry_id` = `ee`.`id`)
            AND (`ee`.`category_id` = `c`.`id`))
    ORDER BY `es`.`start_time_ts`;



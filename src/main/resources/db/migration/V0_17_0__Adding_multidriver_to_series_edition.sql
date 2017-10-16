ALTER TABLE series_edition ADD COLUMN multidriver BIT(1) NULL DEFAULT 0;

UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='6';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='10';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='12';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='19';

-- Allowing an event to be part of many series

CREATE TABLE `SERIES_EVENT` (
  `event_id` bigint(20) NOT NULL,
  `series_id` bigint(20) NOT NULL,
  KEY `FK_series_id_series_event`(`series_id`),
  KEY `FK_event_id_series_event` (`event_id`),
  CONSTRAINT `FK_series_id_series_event` FOREIGN KEY (`series_id`) REFERENCES `series_edition` (`id`),
  CONSTRAINT `FK_event_id_series_event` FOREIGN KEY (`event_id`) REFERENCES `event_edition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

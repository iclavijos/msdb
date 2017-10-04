ALTER TABLE series_edition ADD COLUMN multidriver BIT(1) NULL DEFAULT 0;

UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='6';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='10';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='12';
UPDATE `msdb`.`series_edition` SET `multidriver`=1 WHERE `id`='19';
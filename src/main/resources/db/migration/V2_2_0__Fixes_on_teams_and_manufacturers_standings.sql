ALTER TABLE `manufacturer_event_points` 
CHANGE COLUMN `id` `id` BIGINT(20) NOT NULL AUTO_INCREMENT ;
ALTER TABLE `manufacturer_event_points` 
ADD COLUMN `points` FLOAT NULL DEFAULT 0 AFTER `series_edition_id`;

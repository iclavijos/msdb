ALTER TABLE drivers_entry
ADD COLUMN rookie BIT(1) NULL DEFAULT 0 AFTER driver_id;

ALTER TABLE drivers_entry
ADD COLUMN category INT(11) NULL AFTER rookie;

UPDATE drivers_entry de, event_entry ee
SET de.rookie = ee.rookie
WHERE de.entry_id = ee.id;

ALTER TABLE event_entry
DROP COLUMN rookie;

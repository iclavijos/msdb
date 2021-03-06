ALTER TABLE event_entry_result
ADD COLUMN invalid_fastlap BIT(1) NULL DEFAULT 0 AFTER shared_drive_with_id;


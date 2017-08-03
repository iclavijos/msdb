ALTER TABLE points_system 
ADD COLUMN pct_completed TINYINT NULL DEFAULT 0 AFTER points_fast_lap,
ADD COLUMN minimum_finishing_pos TINYINT NULL DEFAULT 0 AFTER pct_completed,
ADD COLUMN pitlane_start_allowed BIT(1) NULL AFTER minimum_finishing_pos;
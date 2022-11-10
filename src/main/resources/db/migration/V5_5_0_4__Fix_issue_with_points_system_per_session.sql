ALTER TABLE points_system_session
DROP FOREIGN KEY fk_pss_points_system;

ALTER TABLE points_system_session
CHANGE COLUMN points_system_id points_system_id BIGINT(20) NOT NULL,
DROP PRIMARY KEY,
ADD PRIMARY KEY (series_edition_id, session_id, points_system_id);

ALTER TABLE points_system_session
ADD CONSTRAINT fk_pss_points_system
  FOREIGN KEY (points_system_id)
  REFERENCES points_system (id);

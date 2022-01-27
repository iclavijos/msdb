ALTER TABLE user_suscription
DROP FOREIGN KEY IF EXISTS fk_series_suscription;

DELETE FROM user_suscription WHERE user_id <> '1';

ALTER TABLE user_suscription
CHANGE COLUMN series_edition_id series_id BIGINT NOT NULL,
DROP INDEX IF EXISTS fk_series_suscription,
ADD INDEX fk_series_suscription_idx1 (series_id ASC);

ALTER TABLE user_suscription
ADD CONSTRAINT fk_series_suscription
  FOREIGN KEY (series_id)
  REFERENCES series (id);

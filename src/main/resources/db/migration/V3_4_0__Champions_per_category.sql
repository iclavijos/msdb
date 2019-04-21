ALTER TABLE series_drivers_champions 
ADD COLUMN category_id BIGINT(20) NULL AFTER series_edition_id,
ADD INDEX fk_series_driver_champ_category_idx (category_id ASC);
ALTER TABLE series_drivers_champions 
ADD CONSTRAINT fk_series_driver_champ_category
  FOREIGN KEY (category_id)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
ALTER TABLE series_teams_champions 
ADD COLUMN category_id BIGINT(20) NULL AFTER series_edition_id,
ADD INDEX fk_series_team_champ_category_idx (category_id ASC);
ALTER TABLE series_teams_champions 
ADD CONSTRAINT fk_series_team_champ_category
  FOREIGN KEY (category_id)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
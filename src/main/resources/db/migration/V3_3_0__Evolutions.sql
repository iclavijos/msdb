ALTER TABLE tyre_provider
ADD COLUMN letter_color VARCHAR(8) NULL AFTER logo_url,
ADD COLUMN background_color VARCHAR(8) NULL AFTER letter_color;

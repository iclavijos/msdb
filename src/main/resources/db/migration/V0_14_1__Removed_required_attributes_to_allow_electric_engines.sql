ALTER TABLE engine 
CHANGE COLUMN capacity capacity INT(11) NULL ,
CHANGE COLUMN architecture architecture VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NULL;
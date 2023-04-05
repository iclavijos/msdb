CREATE TABLE constants (
  id BIGINT(20) NOT NULL,
  name VARCHAR(45) NOT NULL,
  value VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE);

INSERT INTO constants VALUES (1, 'androidVersion', '1.7.0');

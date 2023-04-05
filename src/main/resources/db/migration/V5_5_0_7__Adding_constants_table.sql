CREATE TABLE constants (
  id BIGINT(20) NOT NULL,
  name VARCHAR(45) NOT NULL UNIQUE,
  value VARCHAR(45) NOT NULL,
  PRIMARY KEY (id));

INSERT INTO constants VALUES (1, 'androidVersion', '1.7.0');

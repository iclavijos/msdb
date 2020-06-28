ALTER TABLE series
ADD COLUMN relevance INT NOT NULL DEFAULT 1000 AFTER logo_url;

-- Tier 1 (Formula 1, Indycar, WEC)
UPDATE series SET relevance = 100 WHERE id = 3;
UPDATE series SET relevance = 101 WHERE id = 6;
UPDATE series SET relevance = 102 WHERE id = 1;

-- Tier 2 (Formula 2, Formula E, IMSA, Super Formula, NASCAR, V8SC)
UPDATE series SET relevance = 200 WHERE id = 4;
UPDATE series SET relevance = 201 WHERE id = 5;
UPDATE series SET relevance = 202 WHERE id = 10;
UPDATE series SET relevance = 203 WHERE id = 26;
UPDATE series SET relevance = 204 WHERE id = 2;
UPDATE series SET relevance = 205 WHERE id = 11;

-- Tier 3 (Formula 3, DTM, BTCC, WTCR, Blancpain, Super GT)
UPDATE series SET relevance = 300 WHERE id = 24;
UPDATE series SET relevance = 301 WHERE id = 8;
UPDATE series SET relevance = 302 WHERE id = 13;
UPDATE series SET relevance = 303 WHERE id = 19;
UPDATE series SET relevance = 304 WHERE id = 7;
UPDATE series SET relevance = 305 WHERE id = 14;

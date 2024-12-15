DROP TABLE IF EXISTS experiments;
DROP TABLE IF EXISTS plateatlas;
DROP TABLE IF EXISTS pumpatlas;

CREATE TABLE plateatlas (
  plateData TEXT
);

CREATE TABLE pumpatlas (
  pumpData TEXT
);

CREATE TABLE experiments (
  title TEXT,
  experimentid INTEGER PRIMARY KEY AUTOINCREMENT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  runHistory TEXT,
  instructions TEXT, 
  tray TEXT
);

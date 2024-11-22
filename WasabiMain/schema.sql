DROP TABLE IF EXISTS experiments;
DROP TABLE IF EXISTS plates;

CREATE TABLE plateatlas (
  plateData TEXT
);

CREATE TABLE experiments (
  experimentid INTEGER PRIMARY KEY AUTOINCREMENT,
  tray INTEGER, 
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT,
  info TEXT,
  instructions TEXT, 
  authorID INTEGER
);

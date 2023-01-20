CREATE TABLE IF NOT EXISTS Auth(
  lid SERIAL8 PRIMARY KEY,
  login TEXT UNIQUE NOT NULL
    CHECK (LENGTH(login) >= 3 AND login ~ E'^[a-zA-Z][-a-zA-Z0-9_@\\.]*$'),
  email TEXT DEFAULT NULL CHECK (email IS NULL OR email ~ E'@'),
  password TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Ann(
  aid SERIAL8 PRIMARY KEY,
  title TEXT NOT NULL CHECK (LENGTH(title) >= 3),
  description TEXT DEFAULT NULL,
  publication TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiration TIMESTAMP DEFAULT NULL CHECK (expiration IS NULL OR expiration > publication),
  starting_price FLOAT NOT NULL CHECK (starting_price > 0),
  current_price FLOAT NOT NULL CHECK (current_price IS NULL OR (current_price >= starting_price AND current_price <= ceiling_price)),
  ceiling_price FLOAT DEFAULT NULL CHECK (ceiling_price IS NULL OR ceiling_price > starting_price),
  over BOOL NOT NULL DEFAULT FALSE,
  lid INT NOT NULL REFERENCES Auth,
  UNIQUE(title, lid)
);

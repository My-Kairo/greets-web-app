CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    greetedTimes int NOT NULL
  );
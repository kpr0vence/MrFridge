// Creates the tables for Mr. Fridge

export const CREATE_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    expiration_date TEXT,
    location_id INTEGER CHECK (location_id IN (1, 2, 3))
  );
`;

export const CREATE_FOOD_INFO_TABLE = `
  CREATE TABLE IF NOT EXISTS food_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    name_no_vowels TEXT NOT NULL,
    days_fridge INTEGER,
    days_pantry INTEGER,
    days_freezer INTEGER
  );
`;

export const CREATE_FOOD_INFO_NAME_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_food_info_name
  ON food_info(name);
`;

export const CREATE_FOOD_INFO_NO_VOWELS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_food_info_name_no_vowels
  ON food_info(name_no_vowels);
`;

export const CREATE_ITEMS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_items
  ON items(id);
`;

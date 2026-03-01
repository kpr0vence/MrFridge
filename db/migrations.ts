// Does the populating / actual creation of the tables

import { SQLiteDatabase } from "expo-sqlite";
import {
  CREATE_FOOD_INFO_NAME_INDEX,
  CREATE_FOOD_INFO_NO_VOWELS_INDEX,
  CREATE_FOOD_INFO_TABLE,
  CREATE_ITEMS_TABLE,
} from "./schema";

import { FOOD_INFO_DATA } from "./seedFoodInfo";

export const DB_VERSION = 2; // Tracks what I've already done for better versioning
// The latest version of the database
// The later user_version (currentVersion) tracks the version that the user has

// Help create the food_info table
function removeVowels(str: string) {
  return str.toLowerCase().replace(/[aeiou]/g, "");
}

// Important guy
export const runMigrations = async (db: SQLiteDatabase) => {
  await db.execAsync("PRAGMA foreign_keys = ON;"); // Pragma is SQLite specific metadata

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  ); // With it I can check the the current version agains the DB version

  const currentVersion = result?.user_version ?? 0;

  // Version 1 – items table
  if (currentVersion < 1) {
    await db.execAsync(CREATE_ITEMS_TABLE);
  }

  // Version 2 – food_info table + seed
  if (currentVersion < 2) {
    await db.execAsync(CREATE_FOOD_INFO_TABLE);
    await db.execAsync(CREATE_FOOD_INFO_NAME_INDEX);
    await db.execAsync(CREATE_FOOD_INFO_NO_VOWELS_INDEX);

    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(`
        INSERT OR IGNORE INTO food_info
        (name, name_no_vowels, days_fridge, days_pantry, days_freezer)
        VALUES (?, ?, ?, ?, ?);
      `);

      try {
        for (const item of FOOD_INFO_DATA) {
          const normalized = removeVowels(item.name);

          await statement.executeAsync([
            item.name,
            normalized,
            item.days_fridge ?? null,
            item.days_pantry ?? null,
            item.days_freezer ?? null,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    });

    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  }
};

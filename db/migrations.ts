// Does the populating / actual creation of the tables

import { SQLiteDatabase } from "expo-sqlite";
import {
  CREATE_FOOD_INFO_NAME_INDEX,
  CREATE_FOOD_INFO_NO_VOWELS_INDEX,
  CREATE_FOOD_INFO_TABLE,
  CREATE_ITEMS_TABLE,
  CREATE_NOTIFICATIONS_TABLE,
} from "./schema";

import * as Notifications from "expo-notifications";
import { ADDITIONS, GENERIC_NAMES } from "./addedItemsV5";
import { FOOD_INFO_DATA } from "./seedFoodInfo";

export const DB_VERSION = 6;
// Tracks what I've already done for better versioning the latest version of the database
// The later user_version (currentVersion) tracks the version that the user has

// Help create the food_info table
function removeVowels(str: string) {
  return str.toLowerCase().replace(/[aeiou]/g, "");
}

// Important guy
export const runMigrations = async (db: SQLiteDatabase) => {
  console.log("Running migrations...");

  await db.execAsync("PRAGMA foreign_keys = ON;");

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  const currentVersion = result?.user_version ?? 0;
  console.log("Current version:", currentVersion);

  if (currentVersion < 1) {
    console.log("Creating items table...");
    await db.execAsync(CREATE_ITEMS_TABLE);
  }

  if (currentVersion < 2) {
    console.log("Creating food_info + seeding...");

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
          console.log("Inserting:", item.name);

          await statement.executeAsync([
            item.name,
            removeVowels(item.name),
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
    console.log("Migration complete.");
  }

  if (currentVersion < 3) {
    console.log("Re-seeding food_info... V3");
    await db.execAsync("DELETE FROM food_info;");
    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(`
      INSERT INTO food_info
      (name, name_no_vowels, days_fridge, days_pantry, days_freezer)
      VALUES (?, ?, ?, ?, ?);
    `);
      try {
        for (const item of FOOD_INFO_DATA) {
          await statement.executeAsync([
            item.name,
            removeVowels(item.name),
            item.days_fridge ?? null,
            item.days_pantry ?? null,
            item.days_freezer ?? null,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    });
    await db.execAsync(`PRAGMA user_version = 3`);
  }

  if (currentVersion < 4) {
    console.log("Cleaning bad table values... V4");
    await db.runAsync("DELETE FROM food_info WHERE name = ?", [
      "ciabatta bread",
    ]);
    await db.execAsync(`PRAGMA user_version = 4`);
  }

  if (currentVersion < 5) {
    console.log("Cleaning notifications... V5");

    console.log(
      "Removing all notifications for clean testing of refactored notifications.",
    );
    await Notifications.cancelAllScheduledNotificationsAsync();
    await db.execAsync(`PRAGMA user_version = 5`);
  }

  if (currentVersion < 7) {
    console.log("Notifications table... V5");
    await Notifications.cancelAllScheduledNotificationsAsync();
    await db.execAsync(CREATE_NOTIFICATIONS_TABLE);

    console.log("Creating new table to manage notification IDs");
    await db.execAsync(`PRAGMA user_version = 7`);
  }

  if (currentVersion < 9) {
    console.log("Purge and recreate notig table... V8");
    await Notifications.cancelAllScheduledNotificationsAsync();
    await db.execAsync(`DROP TABLE IF EXISTS notifications;`);
    await db.execAsync(CREATE_NOTIFICATIONS_TABLE);

    console.log("Creating new table to manage notification IDs");
    await db.execAsync(`PRAGMA user_version = 9`);
  }

  if (currentVersion < 11) {
    console.log("Adding Common Named Items to DB");
    console.log(GENERIC_NAMES);
    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(`
      INSERT INTO food_info
      (name, name_no_vowels, days_fridge, days_pantry, days_freezer)
      VALUES (?, ?, ?, ?, ?);
    `);
      try {
        for (const item of GENERIC_NAMES) {
          await statement.executeAsync([
            item.name,
            removeVowels(item.name),
            item.days_fridge ?? null,
            item.days_pantry ?? null,
            item.days_freezer ?? null,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    });

    await db.execAsync(`PRAGMA user_version = 11`);
  }

  if (currentVersion < 12) {
    console.log("Adding Common Named Items to DB V2...");
    console.log(ADDITIONS);
    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(`
      INSERT INTO food_info
      (name, name_no_vowels, days_fridge, days_pantry, days_freezer)
      VALUES (?, ?, ?, ?, ?);
    `);
      try {
        for (const item of ADDITIONS) {
          await statement.executeAsync([
            item.name,
            removeVowels(item.name),
            item.days_fridge ?? null,
            item.days_pantry ?? null,
            item.days_freezer ?? null,
          ]);
        }
      } finally {
        await statement.finalizeAsync();
      }
    });

    await db.execAsync(`PRAGMA user_version = 12`);
  }
};

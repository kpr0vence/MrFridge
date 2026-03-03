export type ItemType = {
  id: number;
  name: string;
  expiration_date: string;
  location_id: 1 | 2 | 3;
};

export type ItemToAdd = {
  name: string;
  locationId: 1 | 2 | 3;
  daysTilExp: string;
};

export type GuessType = {
  id: number;
  guessedItem: string;
  location: 1 | 2 | 3;
  daysTilExp: string;
};

export type MatchItem = {
  match: string;
  confidence: number;
  isFood: boolean;
};

export type LocationType = "fridge" | "freezer" | "pantry";

// --- TypeScript typings for SQLite ---

export type SQLResultSet = {
  insertId: number;
  rowsAffected: number;
  rows: {
    _array: any[];
    length: number;
    item: (i: number) => any;
  };
};

export type SQLError = {
  code: number;
  message: string;
};

export enum BackgroundTaskResult {
  NoData = 0,
  NewData = 1,
  Failed = 2,
}

export interface SQLTransaction {
  executeSql(
    sqlStatement: string,
    args?: (string | number | null)[],
    success?: (tx: SQLTransaction, resultSet: any) => void,
    error?: (tx: SQLTransaction, error: any) => boolean,
  ): void;
}

export type FoodInfo = {
  name: string;
  days_fridge: number | null;
  days_pantry: number | null;
  days_freezer: number | null;
};

export type ProcessedText = {
  isFood: boolean;
  match: string;
  confidence: number;
};

export type FoodContextInfo = {
  id: number;
  name: string;
  name_no_vowels: string;
  days_fridge: number | null;
  days_pantry: number | null;
  days_freezer: number | null;
};

export type Estimation = {
  locationId: 1 | 2 | 3;
  estimation: number;
  matchFound: boolean;
};

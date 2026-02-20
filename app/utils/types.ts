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

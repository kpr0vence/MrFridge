export type ItemType = {
  id: number;
  name: string;
  expiration_date: string;
  location_id: number;
};

export type ItemToAdd = {
  name: string;
  locationId: 1 | 2 | 3;
  daysTilExp: string;
};

export type GuessType = {
  id: number;
  guessedItem: string;
  originalString: String;
  confidence: number;
};

export type LocationType = "fridge" | "freezer" | "pantry";

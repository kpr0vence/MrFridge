export interface item {
  name: string;
  expireDate: Date; // Should be changed to some form of date object
  isEaten: boolean;
}

export interface groceryContainer {
  fridge: item[];
  freezer: item[];
  pantry: item[];
}

export enum Location {
  PANTRY = "PANTRY",
  FRIDGE = "FRIDGE",
  FREEZER = "FREEZER",
}

// ! New

export type ItemType = {
  id: number;
  name: string;
  expiration_date: string;
  location_id: number;
};

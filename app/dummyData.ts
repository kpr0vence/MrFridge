import { item } from "./types";

const nearExpired: Date = new Date();
nearExpired.setDate(nearExpired.getDate() + 5);

const today: Date = new Date();

export const fridge: item[] = [
  { name: "Strawberries", expireDate: nearExpired, isEaten: false },
  { name: "Milk", expireDate: nearExpired, isEaten: false },
  { name: "Eggs", expireDate: new Date(2025, 9, 20), isEaten: false },
  { name: "Pasta Sauce", expireDate: new Date(2026, 2, 10), isEaten: false },
];

export const freezer: item[] = [
  {
    name: "Chicken Nuggets",
    expireDate: new Date(2026, 9, 17),
    isEaten: false,
  },
  { name: "Ice Cream", expireDate: new Date(2025, 12, 20), isEaten: false },
  { name: "Tater Tot", expireDate: new Date(2025, 2, 10), isEaten: false },
  { name: "Rice", expireDate: getRandomDate(), isEaten: false },
  { name: "Salsa", expireDate: getRandomDate(), isEaten: false },
  { name: "Frozen Mangoes", expireDate: getRandomDate(), isEaten: false },
  { name: "Bread", expireDate: getRandomDate(), isEaten: false },
  { name: "Bagels", expireDate: getRandomDate(), isEaten: false },
  { name: "Sugar Cookeis", expireDate: getRandomDate(), isEaten: false },
  { name: "Popsicle", expireDate: getRandomDate(), isEaten: false },
  { name: "Frozen Peas", expireDate: getRandomDate(), isEaten: false },
  {
    name: "Frozen Cheesecake Bites",
    expireDate: getRandomDate(),
    isEaten: false,
  },
  { name: "Chicken", expireDate: getRandomDate(), isEaten: false },
  { name: "Dinosaur Nuggets", expireDate: getRandomDate(), isEaten: false },
  { name: "Meatballs", expireDate: getRandomDate(), isEaten: false },
];

export const pantry: item[] = [
  { name: "Bread", expireDate: new Date(2025, 10, 20), isEaten: false },
  { name: "Cupcake", expireDate: new Date(2025, 11, 10), isEaten: false },
  { name: "Crackers", expireDate: getRandomDate(), isEaten: false },
  { name: "Cereal", expireDate: getRandomDate(), isEaten: false },
];

export const groceries = {
  fridge: fridge,
  freezer: freezer,
  pantry: pantry,
};

function getRandomDate() {
  const ranDate: Date = new Date();
  const ranNum: number = Math.floor(Math.random() * (50 - 0 + 1));
  ranDate.setDate(ranDate.getDate() + ranNum);

  return ranDate;
}

import { groceryContainer, item } from "./types";

export function getTotalItems(groceries: groceryContainer): number {
  return (
    groceries.fridge.length + groceries.freezer.length + groceries.pantry.length
  );
}

// Returns a list of all the items close to expiration for all locations pantry, fridge, and freezer
export function getItemsCloseToExpiration(groceries: groceryContainer): item[] {
  const to_return: item[] = [
    ...getItemsFromLocationCloseToExpiration(groceries.pantry),
    ...getItemsFromLocationCloseToExpiration(groceries.fridge),
    ...getItemsFromLocationCloseToExpiration(groceries.freezer),
  ];

  return to_return;
}

// Returns a list of items close to expiration for a given location
export function getItemsFromLocationCloseToExpiration(
  location: item[]
): item[] {
  // iterate through the list if the date given is within 5 days, add it
  let to_return: item[] = [];
  const current_date = Date();
  for (let i = 0; i < location.length; i++) {
    // console.log("Item = " +location[i].name+ " Current Date = " +current_date+ " comparrison Date = " +location[i].expireDate)
    if (isCloseToExpired(location[i])) {
      to_return.push(location[i]);
    }
  }

  return to_return;
}

export function getItemsFromLocationExpired(location: item[]): item[] {
  // iterate through the list if the date given is within 5 days, add it
  let to_return: item[] = [];

  for (let i = 0; i < location.length; i++) {
    if (isExpired(location[i])) {
      to_return.push(location[i]);
    }
  }

  return to_return;
}

export function getItemsNotEaten(items: item[]) {
  const to_return: item[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!items[i].isEaten) to_return.push(items[i]);
  }
  return to_return;
}

export function getNumItemsCloseToExpiration(
  groceries: groceryContainer
): number {
  return getItemsCloseToExpiration(groceries).length;
}

export function differenceInDays(date1: Date, date2: Date): number {
  // console.log(date2)
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffInTime = date2.getTime() - date1.getTime();
  return Math.round(diffInTime / oneDay);
}

export function isExpired(item: item) {
  const current_date: Date = new Date();
  return differenceInDays(current_date, item.expireDate) < 0;
}

export function isCloseToExpired(item: item) {
  const current_date: Date = new Date();
  const dif = differenceInDays(current_date, item.expireDate);
  return dif <= 5 && dif >= 0;
}

export function isNotCloseOrExpired(item: item) {
  if (isCloseToExpired(item) || isExpired(item)) {
    return false;
  }
  return true;
}

// *** NEW BACKEND HELPER FUNCTIONS
/**
 * Takes in a JS Date and calculates the difference between that date and today.
 *
 * Returns an integer representing the difference
 */
export function calculateDaysTilExp(laterDate: Date) {
  const currentDate = new Date();

  var diff = Math.abs(laterDate.getTime() - currentDate.getTime());
  var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  console.log(diffDays);
  return diffDays;
}

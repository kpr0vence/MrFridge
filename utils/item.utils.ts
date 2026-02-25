import { ItemType } from "./types";

// Expiration date stuff
// Parse an expiration date from a number to Date
export const parseDaysTilExpiration = (daysTilExp: string): number => {
  const parsed = Number(daysTilExp);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid daysTilExp value: ${daysTilExp}`);
  }

  return parsed;
};

// Given a number of days as string, parse the to number, then create a
// date for that calculated day, then return the string representation
// of that date
export const calculateExpirationDate = (daysTilExp: string): string => {
  const days = parseDaysTilExpiration(daysTilExp);

  const today = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(today.getDate() + days);

  return expirationDate.toISOString();
};

// Do math to find days between current date and given date
export const calculateDaysTilExp = (expiration_date: string): number => {
  const laterDate = new Date(expiration_date);
  const currentDate = new Date();

  const diff = laterDate.getTime() - currentDate.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

// boolean indicating if expired
export const isExpired = (item: ItemType): boolean => {
  return calculateDaysTilExp(item.expiration_date) < 0;
};

// boolean indicating if an item is close to expired, but NOT expired
export const isCloseToExpired = (item: ItemType): boolean => {
  const diff = calculateDaysTilExp(item.expiration_date);
  return diff <= 4 && diff >= 0;
};

// Return all expired items
export const getItemsExpired = (items: ItemType[]): ItemType[] => {
  return items.filter(isExpired);
};

// Return all close to expired items
export const getItemsCloseToExpired = (items: ItemType[]): ItemType[] => {
  return items.filter(isCloseToExpired);
};

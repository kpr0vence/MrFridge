import { CONDIMENTS } from "./foodTypes/condiments";
import { DAIRY } from "./foodTypes/dairy";
import { FISH } from "./foodTypes/fish";
import { FRUITS } from "./foodTypes/fruits";
import { NUTS_PASTA } from "./foodTypes/nuts_pasta";
import { VEGETABLES } from "./foodTypes/vegetables";

// Just the raw info
export const FOOD_INFO_DATA = [
  ...FRUITS,
  ...DAIRY,
  ...VEGETABLES,
  ...FISH,
  ...NUTS_PASTA,
  ...CONDIMENTS,
];

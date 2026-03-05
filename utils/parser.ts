import Fuse from "fuse.js";
import { NonFoodItems } from "./commonItemsList";
// import Fuse from 'https://deno.land/x/fuse@v7.1.0/dist/fuse.min.mjs'

type Match = {
  match: string;
  confidence: number;
};

function devowel(word: string) {
  return word.replace(/[aeiou]/gi, "");
}

function normalize(word: string) {
  return word.endsWith("es")
    ? word.slice(0, -2)
    : word.endsWith("s")
      ? word.slice(0, -1)
      : word;
}

function calculate_confidence(score: number | undefined) {
  return 100 - (score ?? 0) * 100;
}

function get_potential_term(receipt_line: string) {
  let cleaned_line = receipt_line;

  cleaned_line = cleaned_line.replace(/\d/g, ""); // Remove digits
  cleaned_line = cleaned_line.replace(/[^\p{L}\s]/gu, ""); // Clean punctuation
  cleaned_line = cleaned_line.replace(/\b[a-z]\b/gi, ""); // Remove single letter phrases

  return cleaned_line.trim().toLowerCase();
}

// Global variables
const devoweled_non_food_items = NonFoodItems.map((item) => devowel(item));

const fuse_options = {
  includeScore: true,
  threshold: 0.8, // how forgiving the match is 0 = strict 1 = most forgiving
  distance: 1, // How far apart the characters are before score is affected.
  ignoreLocation: true, // removes preference for matches near start
  minMatchCharLength: 2,
};

// Fuse instances (that aren't dynamic)
const nonFoodFuse = new Fuse(NonFoodItems, fuse_options);
const nonFoodDevowelFuse = new Fuse(devoweled_non_food_items, fuse_options);

// **************
// FUZZY MATCHING
// **************
function fuzzy_match_single_term(
  fuse: Fuse<string>,
  product_term: string,
): Match {
  const normalized_term = normalize(product_term.toLowerCase());
  const searchResult = fuse.search(normalized_term);

  if (searchResult.length === 0) {
    return { match: "", confidence: 0 };
  }

  const confidence = calculate_confidence(searchResult[0].score);

  return {
    match: searchResult[0].item,
    confidence,
  };
}

function fuzzy_match_term_vowels_and_none(
  term: string,
  fuse: Fuse<string>,
  devowelFuse: Fuse<string>,
  items: string[],
  devoweledItems: string[],
): Match {
  if (!term) return { match: "undefined", confidence: 0 };
  if (term.length < 3) return { match: "", confidence: 0 };

  const normal = fuzzy_match_single_term(fuse, normalize(term));

  const noVowels = fuzzy_match_single_term(
    devowelFuse,
    devowel(normalize(term)),
  );

  return noVowels.confidence > normal.confidence
    ? {
        match: items[devoweledItems.indexOf(noVowels.match)],
        confidence: noVowels.confidence,
      }
    : normal;
}

function fuzzy_match_product_line(
  product_term: string,
  fuse: Fuse<string>,
  devowelFuse: Fuse<string>,
  items: string[],
  devoweledItems: string[],
): Match {
  const terms = product_term.split(/\s+/);

  let highest_confidence_match = fuzzy_match_term_vowels_and_none(
    terms[0],
    fuse,
    devowelFuse,
    items,
    devoweledItems,
  );

  for (let i = 1; i < terms.length; i++) {
    const term_match = fuzzy_match_term_vowels_and_none(
      terms[i],
      fuse,
      devowelFuse,
      items,
      devoweledItems,
    );

    if (term_match.confidence > highest_confidence_match.confidence) {
      highest_confidence_match = term_match;
    }
  }

  return highest_confidence_match;
}

// Master function. Calculates the match scores of non-food and food
function find_grocery_item(
  receipt_line: string,
  ITEMS: string[],
  ITEMS_NO_VOWEL: string[],
  foodFuse: Fuse<string>,
  foodDevowelFuse: Fuse<string>,
) {
  const potential_term = get_potential_term(receipt_line);

  const non_food_match = fuzzy_match_product_line(
    potential_term,
    nonFoodFuse,
    nonFoodDevowelFuse,
    NonFoodItems,
    devoweled_non_food_items,
  );

  const food_match = fuzzy_match_product_line(
    potential_term,
    foodFuse,
    foodDevowelFuse,
    ITEMS,
    ITEMS_NO_VOWEL,
  );

  return { non_food_match, food_match };
}

function determine_if_food(non_food_match: Match, food_match: Match) {
  return non_food_match.confidence <= food_match.confidence;
}

export default function process_text(
  receipt_line: string,
  ITEMS: string[],
  ITEMS_NO_VOWEL: string[],
) {
  // Build food fuse indexes once per dataset
  const foodFuse = new Fuse(ITEMS, fuse_options);
  const foodDevowelFuse = new Fuse(ITEMS_NO_VOWEL, fuse_options);

  const { non_food_match, food_match } = find_grocery_item(
    receipt_line,
    ITEMS,
    ITEMS_NO_VOWEL,
    foodFuse,
    foodDevowelFuse,
  );

  if (determine_if_food(non_food_match, food_match)) {
    return { ...food_match, isFood: true };
  } else {
    return { ...non_food_match, isFood: false };
  }
}

// 80% = high confidence

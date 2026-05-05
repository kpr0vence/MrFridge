import Fuse from "fuse.js";
import { NonFoodItems } from "./commonItemsList";
// import Fuse from 'https://deno.land/x/fuse@v7.1.0/dist/fuse.min.mjs'

// TODO: Finish refining the logic, consulting findings

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
  threshold: 0.4, // ! New: how forgiving the match is 0 = strict 1 = most forgiving
  // ^^ Modified upon algorithm revisions
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

// ! New
function fuzzy_match_full_line(
  fuse: Fuse<string>,
  product_line: string,
): Match {
  const normalized_line = product_line.toLowerCase();
  const searchResult = fuse.search(normalized_line);

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

  // ! New: The devoweled version, while helfpul for reading reciepts can be too similar
  // to a bunch of terms, giving it too much power. Prefer the normal match if it
  // is moderately to very confident (> 70)
  if (noVowels.confidence > normal.confidence && normal.confidence < 70) {
    return {
      match: items[devoweledItems.indexOf(noVowels.match)],
      confidence: noVowels.confidence,
    };
  } else return normal;
}

//! New: Consider: "Human" sanity check aka “Do these words
// visibly resemble each other at all?”
//    Downside --> may make the matching algorithm slower
function hasOverlap(a: string, b: string) {
  const minLen = 2;

  for (let i = 0; i < a.length - minLen + 1; i++) {
    const sub = a.slice(i, i + minLen);
    if (b.includes(sub)) {
      return true;
    }
  }

  return false;
}

// Function responsible for gathering all individual matches,
// and comparing their confidences to pick the best option
// Called twice by parent function (for food and non food matches)
function fuzzy_match_product_line(
  product_term: string,
  fuse: Fuse<string>,
  devowelFuse: Fuse<string>,
  items: string[],
  devoweledItems: string[],
): Match {
  const terms = product_term.split(/\s+/);

  // ! New
  let full_line_match = fuzzy_match_full_line(fuse, product_term);

  let highest_confidence_match = full_line_match; // Default to full line is
  // highest confidence

  for (let i = 0; i < terms.length; i++) {
    const term_match = fuzzy_match_term_vowels_and_none(
      terms[i],
      fuse,
      devowelFuse,
      items,
      devoweledItems,
    );

    const single_term_weighted_confidence = term_match.confidence - 10;
    // ! New: The full line match should be preferred over a single term match
    // since it's more likely to be wrong, so make the confidence lower on
    // the single term to give the full line a boost

    // ! New: Consider: Human check
    if (!hasOverlap(terms[i], term_match.match)) {
      continue;
    }

    if (term_match.confidence > highest_confidence_match.confidence) {
      highest_confidence_match = term_match;
    }
  }

  return highest_confidence_match;
}

function determine_if_food(non_food_match: Match, food_match: Match) {
  return non_food_match.confidence <= food_match.confidence;
}

// Calculates the match scores of non-food and food
// (parent of fuzzy_match_product_line)
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

// Master function that sets up the Fuse objects and gathers the food
// and non food match, making the final decision
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

  // ! New: Give exact matches found in the db a VERY high score without bothering with the rest
  for (const item of ITEMS) {
    if (receipt_line.includes(item) && receipt_line !== "cheese") {
      const matchItem = {
        match: item,
        confidence: 100,
        isFood: true,
      };

      return matchItem;
    }
  }

  if (determine_if_food(non_food_match, food_match)) {
    return { ...food_match, isFood: true };
  } else {
    return { ...non_food_match, isFood: false };
  }
}

// 80% = high confidence

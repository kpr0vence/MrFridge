import Fuse from "fuse.js";
import { NonFoodItems } from "./commonItemsList";
// import Fuse from 'https://deno.land/x/fuse@v7.1.0/dist/fuse.min.mjs'

type Match = {
  match: String;
  confidence: number;
};

const devoweled_non_food_items = NonFoodItems.map((item) => devowel(item));

function get_potential_term(reciept_line: String) {
  let cleaned_line = reciept_line;

  let re = /\d/gi; // Remove digits
  cleaned_line = reciept_line.replaceAll(re, "");

  re = /\p{P}/gu; // Clean punctuation
  cleaned_line = cleaned_line.replaceAll(re, "");

  re = /(\s|^)\w(\s|$)/gi; // Remove single letter phrases
  cleaned_line = cleaned_line.replaceAll(re, "");

  return cleaned_line.trim().toLocaleLowerCase();
}

function calculate_confidence(score: number | undefined) {
  return 100 - (score ? score : 0) * 100;
}

function fuzzy_match_single_term(itemsList: string[], product_term: string) {
  const options = {
    includeScore: true,
    threshold: 0.8, // how forgiving the match is 0 = strict 1 = most forgiving
    distance: 1, // How far apart the characters are before score is affected.
    ignoreLocation: true, // removes preference for matches near start
    minMatchCharLength: 2,
  };
  const fuse = new Fuse(itemsList, options);
  // Given a term string
  const normalized_term = normalize(product_term.toLocaleLowerCase());
  const searchResult = fuse.search(normalized_term);
  if (searchResult.length === 0) {
    return { match: "", confidence: 0 };
  }
  const confidence = calculate_confidence(searchResult[0].score);
  return { match: searchResult[0].item, confidence: confidence };
}

function fuzzy_match_term_vowels_and_none(
  items: string[],
  term: string,
  ITEMS_NO_VOWEL?: string[],
) {
  if (!term) return { match: "undefined", confidence: 0 };
  if (term && term.length < 3) return { match: "", confidence: 0 };

  const devoweled_items: string[] = items.map((item) => {
    return devowel(item);
  });

  const normal = fuzzy_match_single_term(items, normalize(term));
  const noVowels = fuzzy_match_single_term(
    devoweled_items,
    devowel(normalize(term)),
  );
  return noVowels.confidence > normal.confidence
    ? {
        match: items[devoweled_items.indexOf(noVowels.match)],
        confidence: noVowels.confidence,
      }
    : normal;
}

function devowel(word: string) {
  return word.replace(/[aeiou]/g, "");
}

function normalize(word: string) {
  return word.endsWith("es")
    ? word.slice(0, -2)
    : word.endsWith("s")
      ? word.slice(0, -1)
      : word;
}

function fuzzy_match_product_line(
  product_term: String,
  ITEMS: string[],
  ITEMS_NO_VOWEL: string[],
) {
  // split the string
  const terms = product_term.split(/\s+/);
  // Start with the confidence of the first term
  let highest_confidence_match = fuzzy_match_term_vowels_and_none(
    ITEMS,
    terms[0],
  );
  // iterate and check the rest
  for (let i = 0; i < terms.length; i++) {
    const term_match = fuzzy_match_term_vowels_and_none(
      ITEMS,
      terms[i],
      ITEMS_NO_VOWEL,
    );
    if (term_match.confidence > highest_confidence_match.confidence)
      highest_confidence_match = term_match;
  }
  return highest_confidence_match;
}

function find_grocery_item(
  reciept_line: String,
  ITEMS: string[],
  ITEMS_NO_VOWEL: string[],
) {
  const potential_term = get_potential_term(reciept_line);
  const non_food_match = fuzzy_match_product_line(
    potential_term,
    NonFoodItems,
    devoweled_non_food_items,
  );
  const match = fuzzy_match_product_line(potential_term, ITEMS, ITEMS_NO_VOWEL);
  return { non_food_match: non_food_match, food_match: match };
}

function determine_if_food(non_food_match: Match, food_match: Match) {
  return non_food_match.confidence <= food_match.confidence;
}

export default function process_text(
  reciept_line: String,
  ITEMS: string[],
  ITEMS_NO_VOWEL: string[],
) {
  const { non_food_match, food_match } = find_grocery_item(
    reciept_line,
    ITEMS,
    ITEMS_NO_VOWEL,
  );
  // console.log(
  //   `Nonfood: ${non_food_match.match} ${non_food_match.confidence} Food: ${food_match.match} ${food_match.confidence}`,
  // );
  if (determine_if_food(non_food_match, food_match)) {
    // if it is food, return the food object
    return { ...food_match, isFood: true };
  } else {
    return { ...non_food_match, isFood: false };
  }
}

// 80% = high confidence

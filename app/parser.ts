import Fuse from "fuse.js";
import { GroceryItems, NonFoodItems } from "./commonItemsList";
// import Fuse from 'https://deno.land/x/fuse@v7.1.0/dist/fuse.min.mjs'

// ingles specific
function check_first_letter(reciept_line: String) {
  const cleaned_line = reciept_line.trim().toLowerCase();
  switch (cleaned_line[0]) {
    case "a":
      return true;
    case "b":
      return false;
    default:
      return false;
  }
}

type Match = {
  match: String;
  confidence: number;
};

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

function check_for_non_food_item(product_term: String) {
  const options = {
    includeScore: true,
    threshold: 1, // allow all matches
    ignoreLocation: true, // critical for OCR
    minMatchCharLength: 2,
  };
  const fuse = new Fuse(NonFoodItems, options);
  const searchResult = fuse.search(product_term.toLocaleLowerCase());
  // const searchResult = [{ item: "orange", score: 21 }];
  if (searchResult.length === 0) {
    return { match: "", confidence: 100 };
  }
  const confidence = calculate_confidence(searchResult[0].score);
  return { match: searchResult[0].item, confidence: confidence };
}

function fuzzy_match_product_term(product_term: String) {
  const options = {
    includeScore: true,
    threshold: 1, // allow all matches
    ignoreLocation: true, // critical for OCR
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(GroceryItems, options);
  const searchResult = fuse.search(product_term.toLocaleLowerCase());
  // const searchResult = [{ item: "orange", score: 21 }];

  if (searchResult.length === 0) {
    return { match: "", confidence: 1 };
  }
  const confidence = calculate_confidence(searchResult[0].score);
  return { match: searchResult[0].item, confidence: confidence };
}

function find_grocery_item(reciept_line: String) {
  const potential_term = get_potential_term(reciept_line);
  const non_food_match = check_for_non_food_item(potential_term);
  const match = fuzzy_match_product_term(potential_term);
  return { non_food_match: non_food_match, food_match: match };
}

function determine_if_food(non_food_match: Match, food_match: Match) {
  return non_food_match.confidence < food_match.confidence;
}

export default function process_text(reciept_line: String) {
  const { non_food_match, food_match } = find_grocery_item(reciept_line);
  if (determine_if_food(non_food_match, food_match)) {
    // if it is food, return the food object
    return { ...food_match, isFood: true };
  } else {
    return { ...non_food_match, isFood: false };
  }
}

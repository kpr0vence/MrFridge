import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import process_text from "./parser";
import { Estimation, FoodContextInfo, ProcessedText } from "./types";

// task: provide all functionality for interacting with the food_info table
// id, name, name_no_vowels, days_fridge, days_pantry, days_freezer\

type NameGroup = {
  nameWithVowels: string;
  nameNoVowel: string;
};

interface FoodContextType {
  parseName: (line: String) => ProcessedText;
  estimateItem: (name: string) => Promise<Estimation>;
  estimateItemAtLocation: (
    name: string,
    locationId: 1 | 2 | 3,
  ) => Promise<Estimation>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);
export const FoodProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const database = useSQLiteContext();

  const [items, setItems] = useState<FoodContextInfo[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [namesNoVowels, setNamesNoVowels] = useState<string[]>([]);

  const loadData = useCallback(
    async (isMounted: () => boolean) => {
      const result = await database.getAllAsync<FoodContextInfo>(
        "SELECT * FROM food_info;",
      );
      if (!isMounted()) return;
      setItems(result);
      setNames(result.map((item) => item.name));
      setNamesNoVowels(result.map((item) => item.name_no_vowels));
    },
    [database],
  );

  useEffect(() => {
    let mounted = true;
    loadData(() => mounted);

    return () => {
      mounted = false;
    };
  }, [loadData]); // Load the mounted data if the db data chages

  // Takes over the task of calling parser.py to allow it to pass in the new info
  function parseName(line: String) {
    const guess = process_text(line, names, namesNoVowels);
    console.log(`The guessed item for "${line}": ${guess.match}`);
    return guess;
  }

  async function estimateItem(name: string) {
    // Given the name, get it's estimation from the db
    let estimate: Estimation = {
      locationId: 1,
      estimation: 7,
      matchFound: false,
    }; //   default to 7 days in fridge
    const result = await database.getFirstAsync<FoodContextInfo>(
      "SELECT * FROM food_info WHERE name LIKE ?;",
      [name],
    );

    // Now we should have an item, next find the first location it has data for, return that
    if (result && result.days_fridge)
      estimate = {
        locationId: 1,
        estimation: result.days_fridge,
        matchFound: true,
      };
    else if (result && result.days_pantry)
      estimate = {
        locationId: 2,
        estimation: result.days_pantry,
        matchFound: true,
      };
    else if (result && result.days_freezer)
      estimate = {
        locationId: 3,
        estimation: result.days_freezer,
        matchFound: true,
      };
    console.log(
      `estimate for ${name} is ${estimate.estimation} in the location id ${estimate.locationId}`,
    );
    return estimate;
  }

  async function estimateItemAtLocation(name: string, locationId: 1 | 2 | 3) {
    let estimate: Estimation = {
      locationId: 1,
      estimation: 0,
      matchFound: false,
    };
    const result = await database.getFirstAsync<FoodContextInfo>(
      "SELECT * FROM food_info WHERE name LIKE ?;",
      [name],
    );

    //   Then try to pick it based on location ID and result
    if (locationId == 1 && result && result.days_fridge)
      estimate = {
        locationId: 1,
        estimation: result.days_fridge,
        matchFound: true,
      };
    else if (locationId == 2 && result && result.days_pantry)
      estimate = {
        locationId: 2,
        estimation: result.days_pantry,
        matchFound: true,
      };
    else if (locationId == 3 && result && result.days_freezer)
      estimate = {
        locationId: 3,
        estimation: result.days_freezer,
        matchFound: true,
      };

    console.log(
      `estimate for ${name} is ${estimate.estimation} in the location id ${estimate.locationId}`,
    );
    return estimate;
  }

  return (
    <FoodContext.Provider
      value={{ parseName, estimateItem, estimateItemAtLocation }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodData = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (!context)
    throw new Error("useFoodData must be used within a FoodProvider");
  return context;
};

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useFoodData } from "../app/FoodContext";
import { GuessType, MatchItem } from "./types";

interface GuessContextType {
  guessedItems: GuessType[];
  setGuessedItems: Dispatch<SetStateAction<GuessType[]>>;
  textToItemMatch: (textObj: any) => MatchItem[];
  matchToEstimation: (matches: MatchItem[]) => Promise<GuessType[]>;
}

const GuessContext = createContext<GuessContextType | undefined>(undefined);
export const GuessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guessedItems, setGuessedItems] = useState<GuessType[]>([]);
  const { parseName, estimateItem } = useFoodData();

  // get the lines and then call /parser.ts parse_text() function per line, storing the results
  function textToItemMatch(textObj: any): MatchItem[] {
    const lines = textObj.lines;
    const itemNames: MatchItem[] = lines
      .map((line: string) => {
        return parseName(line);
      })
      .filter((item: MatchItem) => item.isFood);

    return itemNames;
  }

  // Take the items and make the estimates. This is where we'd interact with the db and choose location
  async function matchToEstimation(matches: MatchItem[]): Promise<GuessType[]> {
    // The process should be matching it to something, then picking guessed location
    const estimates = await Promise.all(
      matches.map(async (item: MatchItem, index) => {
        const { locationId, estimation } = await estimateItem(item.match);

        return {
          id: index,
          guessedItem: item.match,
          location: locationId, // Just default to fridge for now
          daysTilExp: estimation.toString(),
        };
      }),
    );

    return estimates;
  }

  function getEstimation(itemName: String, locationChoice: 1 | 2 | 3): number {
    // Here you would try to select a specific item name from the db
    // If found, select based on location and done
    // if not found do some basic estimation logic
    return 5;
  }

  return (
    <GuessContext.Provider
      value={{
        guessedItems,
        setGuessedItems,
        textToItemMatch,
        matchToEstimation,
      }}
    >
      {children}
    </GuessContext.Provider>
  );
};

export const useGuessData = (): GuessContextType => {
  const context = useContext(GuessContext);
  if (!context)
    throw new Error("useGuessData must be used within a GuessProvider");
  return context;
};

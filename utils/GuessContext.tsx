import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useFoodData } from "./FoodContext";
import { GuessType, MatchItem } from "./types";

interface GuessContextType {
  guessedItems: GuessType[];
  setGuessedItems: Dispatch<SetStateAction<GuessType[]>>;
  textToItemMatch: (textObj: any) => MatchItem[];
  matchToEstimation: (matches: MatchItem[]) => Promise<GuessType[]>;
}

const GuessContext = createContext<GuessContextType | undefined>(undefined);

// Handles the process of taking raw lines of text and converting them
// into guessed items (with all the info that comes with)
// Interacts heavily with the food context
export const GuessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guessedItems, setGuessedItems] = useState<GuessType[]>([]);
  const { parseName, estimateItem } = useFoodData();

  // get the lines and then call /parser.ts parse_text() function (using the food data hook)
  // per line, storing the results
  function textToItemMatch(textObj: any): MatchItem[] {
    const lines = textObj.lines;
    const itemNames: MatchItem[] = lines
      .map((line: string) => {
        return { ...parseName(line), originalLine: line };
      })
      .filter((item: MatchItem) => item.isFood); // Filters out returned items flagged as not food

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
          location: locationId,
          daysTilExp: estimation.toString(),
          originalLine: item.originalLine ? item.originalLine : null,
          confidence: item.confidence,
        };
      }),
    );

    return estimates;
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

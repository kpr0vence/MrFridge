import { useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ItemType } from "./types";

interface DataContextType {
  data: ItemType[];
  fridge: ItemType[];
  pantry: ItemType[];
  freezer: ItemType[];
  handleSubmit: (
    name: string,
    locationId: string,
    daysTilExp: string
  ) => Promise<void>;
  handleUpdate: (
    id: number,
    name: string,
    locationId: number,
    daysTilExp: string
  ) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  getItemById: (id: number) => Promise<ItemType | null>;
  getItemsCloseToExpired: (items: ItemType[]) => ItemType[];
  getItemsExpired: (items: ItemType[]) => ItemType[];
  getTotalItems: () => number;
  getDataFromLocation: (location: string) => ItemType[];
  calculateDaysTilExp: (expiration_date: string) => number;
  isExpired: (item: ItemType) => boolean;
  isCloseToExpired: (item: ItemType) => boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const database = useSQLiteContext();

  const [data, setData] = useState<ItemType[]>([]);
  const [fridge, setFridge] = useState<ItemType[]>([]);
  const [pantry, setPantry] = useState<ItemType[]>([]);
  const [freezer, setFreezer] = useState<ItemType[]>([]);

  const loadData = async () => {
    const result = await database.getAllAsync<ItemType>(
      "SELECT * FROM items ORDER BY expiration_date;"
    ); // Add order by statement
    const fridgeResult = await database.getAllAsync<ItemType>(
      "SELECT * FROM items WHERE location_id = 1;"
    );
    const pantryResult = await database.getAllAsync<ItemType>(
      "SELECT * FROM items WHERE location_id = 2;"
    );
    const freezerResult = await database.getAllAsync<ItemType>(
      "SELECT * FROM items WHERE location_id = 3;"
    );

    setData(result);
    setFridge(fridgeResult);
    setPantry(pantryResult);
    setFreezer(freezerResult);
  };

  const handleSubmit = async (
    name: string,
    locationId: string,
    daysTilExp: string
  ) => {
    const today = new Date();
    const dateToInsert = new Date();
    dateToInsert.setDate(today.getDate() + parseInt(daysTilExp));

    try {
      await database.runAsync(
        "INSERT INTO items (name, expiration_date, location_id) VALUES (?, ?, ?);",
        [name, dateToInsert.toISOString(), locationId]
      );
      await loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (
    id: number,
    name: string,
    locationId: number,
    daysTilExp: string
  ) => {
    try {
      const today = new Date();
      const dateToInsert = new Date();
      dateToInsert.setDate(today.getDate() + parseInt(daysTilExp));

      await database.runAsync(
        `UPDATE items SET name = ?, expiration_date = ?, location_id = ? WHERE id = ?`,
        [name, dateToInsert.toISOString(), locationId, id]
      );
      // router.back();
      await loadData();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  const getItemById = async (id: number) => {
    const result = await database.getFirstAsync<ItemType>(
      "SELECT name, expiration_date, location_id FROM items WHERE id = ?;",
      [parseInt(id as unknown as string)]
    );

    return result ?? null;
  };

  const handleDelete = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM items WHERE id = ?;", [id]);
      loadData(); // to redraw the guys
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  });

  // Function to help get the distance between one day and the current date
  function calculateDaysTilExp(expiration_date: string) {
    const laterDate = new Date(expiration_date);

    const currentDate = new Date();

    const diff = laterDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays;
  }

  // Public to get all of the items close to expiration (can be done with .length to get the number of them)
  function getItemsCloseToExpired(items: ItemType[]) {
    let to_return: ItemType[] = [];

    for (let i = 0; i < items.length; i++) {
      if (isCloseToExpired(items[i])) {
        to_return.push(items[i]);
      }
    }
    return to_return;
  }

  // Same as above but for expired
  function getItemsExpired(items: ItemType[]) {
    let to_return: ItemType[] = [];

    for (let i = 0; i < items.length; i++) {
      if (isExpired(items[i])) {
        to_return.push(items[i]);
      }
    }
    return to_return;
  }

  // Private function to help the getItemsExpired function
  function isExpired(item: ItemType) {
    return calculateDaysTilExp(item.expiration_date) < 0;
  }

  // Private function to help the getItemsCloseToExpired function
  function isCloseToExpired(item: ItemType) {
    const dif = calculateDaysTilExp(item.expiration_date);
    return dif <= 5 && dif >= 0;
  }

  const getTotalItems = () => {
    return data.length;
  };

  const getDataFromLocation = (location: string) => {
    if (location.toLowerCase() === "fridge") return fridge;

    if (location.toLowerCase() === "pantry") return pantry;

    return freezer;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        fridge,
        pantry,
        freezer,
        handleSubmit,
        handleUpdate,
        getItemById,
        handleDelete,
        getItemsCloseToExpired,
        getItemsExpired,
        getTotalItems,
        getDataFromLocation,
        calculateDaysTilExp,
        isExpired,
        isCloseToExpired,
        refresh: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  calculateDaysTilExp,
  calculateExpirationDate,
  getItemsCloseToExpired,
  getItemsExpired,
  isCloseToExpired,
  isExpired,
} from "./utils/item.utils";
import { ItemToAdd, ItemType } from "./utils/types";

interface DataContextType {
  database: SQLiteDatabase;
  data: ItemType[];
  fridge: ItemType[];
  pantry: ItemType[];
  freezer: ItemType[];
  loading: boolean; // New loading flag
  handleSubmit: (
    items: ItemToAdd[],
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => Promise<void>;
  handleUpdate: (
    id: number,
    name: string,
    locationId: number,
    daysTilExp: string,
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => Promise<void>;
  handleDelete: (
    id: number,
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => Promise<void>;
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

// Helper functions in /utils/item.utils.ts
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const database = useSQLiteContext();

  const [data, setData] = useState<ItemType[]>([]);
  const [fridge, setFridge] = useState<ItemType[]>([]);
  const [pantry, setPantry] = useState<ItemType[]>([]);
  const [freezer, setFreezer] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false); // New loading state

  // Load the data into state variables
  const loadData = useCallback(
    async (isMounted: () => boolean) => {
      const result = await database.getAllAsync<ItemType>(
        "SELECT * FROM items ORDER BY expiration_date;",
      );
      // make one call to the db, then filter them to set fridge,
      // freezer, and pantry states (more efficient than multiple DB calls)
      if (!isMounted()) return; // If there was an error end early

      setData(result);
      setFridge(result.filter((i) => i.location_id === 1));
      setPantry(result.filter((i) => i.location_id === 2));
      setFreezer(result.filter((i) => i.location_id === 3));
    },
    [database], // Updates if the value of databse updates
  );

  useEffect(() => {
    let mounted = true;
    loadData(() => mounted);
    return () => {
      mounted = false;
    };
  }, [loadData]); // Load the mounted data if the db data chages

  // Helper functions to prepare for batch insertion of items
  // Makes the needed amount of placeholders for the eventual insert string
  const buildPlaceholders = (count: number): string =>
    [...Array(count)].map(() => "(?, ?, ?)").join(", ");

  // Puts the items into the placeholders
  const buildInsertValues = (items: ItemToAdd[]) =>
    items.flatMap((item) => [
      // Have to use flatmap so that SQLite will recognize it (has to be all one array)
      item.name,
      calculateExpirationDate(item.daysTilExp),
      item.locationId,
    ]);

  // Actually submit any number of items passed in
  const handleSubmit = async (
    items: ItemToAdd[],
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => {
    if (!items.length) return;

    setLoading(true);

    try {
      await database.execAsync("BEGIN TRANSACTION;");

      const placeholders = buildPlaceholders(items.length);
      const values = buildInsertValues(items); // ← calculateExpirationDate runs safely inside try

      await database.runAsync(
        `INSERT INTO items (name, expiration_date, location_id) VALUES ${placeholders};`,
        values,
      );

      await database.execAsync("COMMIT;");
      await refreshData();
      onSuccess?.();
    } catch (error) {
      await database.execAsync("ROLLBACK;").catch(() => {}); // ensure rollback never throws
      onFailure?.(error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an item
  const handleUpdate = async (
    id: number,
    name: string,
    locationId: number,
    daysTilExp: string,
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => {
    setLoading(true);

    try {
      const expirationDate = calculateExpirationDate(daysTilExp);

      await database.runAsync(
        `UPDATE items
         SET name = ?, expiration_date = ?, location_id = ?
         WHERE id = ?`,
        [name, expirationDate, locationId, id],
      );

      await refreshData();
      onSuccess?.();
    } catch (error) {
      onFailure?.(error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const handleDelete = async (
    id: number,
    onSuccess?: () => void,
    onFailure?: (error: unknown) => void,
  ) => {
    setLoading(true);

    try {
      await database.runAsync("DELETE FROM items WHERE id = ?;", [id]);
      await refreshData();
      onSuccess?.();
    } catch (error) {
      onFailure?.(error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  // Other helpers
  const getItemById = async (id: number) => {
    const result = await database.getFirstAsync<ItemType>(
      "SELECT * FROM items WHERE id = ?;",
      [id],
    );

    return result ?? null;
  };

  const getTotalItems = () => data.length;

  const getDataFromLocation = (location: string) => {
    const lower = location.toLowerCase();
    if (lower === "fridge") return fridge;
    if (lower === "pantry") return pantry;
    return freezer;
  };

  async function refreshData() {
    await loadData(() => true);
  }

  return (
    <DataContext.Provider
      value={{
        database,
        data,
        fridge,
        pantry,
        freezer,
        loading, // expose loading
        handleSubmit,
        handleUpdate,
        handleDelete,
        getItemById,
        getItemsCloseToExpired,
        getItemsExpired,
        getTotalItems,
        getDataFromLocation,
        calculateDaysTilExp,
        isExpired,
        isCloseToExpired,
        refresh: refreshData,
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

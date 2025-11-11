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
  handleSubmit: (
    name: string,
    locationId: string,
    daysTilExp: string
  ) => Promise<void>;
  handleUpdate: (
    id: number,
    name: string,
    locationId: string,
    daysTilExp: string
  ) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  getItemById: (id: number) => Promise<ItemType | null>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const database = useSQLiteContext();

  const [data, setData] = useState<ItemType[]>([]);

  const loadData = async () => {
    const result = await database.getAllAsync<ItemType>("SELECT * FROM items;");
    setData(result);
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
    locationId: string,
    daysTilExp: string
  ) => {
    try {
      const today = new Date();
      const dateToInsert = new Date();
      dateToInsert.setDate(today.getDate() + parseInt(daysTilExp));

      const response = await database.runAsync(
        `UPDATE items SET name = ?, expiration_date = ?, location_id = ? WHERE id = ?`,
        [
          name,
          dateToInsert.toISOString(),
          locationId,
          parseInt(id as unknown as string),
        ]
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
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        handleSubmit,
        handleUpdate,
        getItemById,
        handleDelete,
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

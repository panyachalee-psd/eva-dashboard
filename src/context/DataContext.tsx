import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
type DataContextType = {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const fetchData = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await fetch("https://official-joke-api.appspot.com/random_joke");
  //     if (!res.ok) throw new Error("Network error");
  //     console.log('res', res);

  //     const json = await res.json();
  //     console.log('resjson', json);

  //     setData(json);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    await axios
      .get("https://official-joke-api.appspot.com/random_joke")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

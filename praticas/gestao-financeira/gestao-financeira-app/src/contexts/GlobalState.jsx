import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    try {
      const [cats, trans] = await Promise.all([
        api.getCategories(),
        api.getTransactions(),
      ]);

      setCategories(cats);
      setTransactions(trans);
    } catch (error) {
      console.log("Erro ao buscar dados da API", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MoneyContext.Provider
      value={{
        transactions,
        categories,
        loadData,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}
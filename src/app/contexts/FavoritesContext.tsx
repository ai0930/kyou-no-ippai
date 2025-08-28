"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (drinkName: string) => void;
  removeFavorite: (drinkName: string) => void;
  isFavorite: (drinkName: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("drinkFavorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("drinkFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (drinkName: string) => {
    setFavorites((prev) =>
      prev.includes(drinkName)
        ? prev.filter((name) => name !== drinkName)
        : [...prev, drinkName]
    );
  };

  const removeFavorite = (drinkName: string) => {
    setFavorites((prev) => prev.filter((name) => name !== drinkName));
  };

  const isFavorite = (drinkName: string) => {
    return favorites.includes(drinkName);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

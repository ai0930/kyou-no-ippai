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
    const normalized = drinkName.trim();
    setFavorites((prev) =>
      prev.map((n) => n.trim()).includes(normalized)
        ? prev.filter((name) => name.trim() !== normalized)
        : [...prev, normalized]
    );
  };

  const removeFavorite = (drinkName: string) => {
    const normalized = drinkName.trim();
    setFavorites((prev) => prev.filter((name) => name.trim() !== normalized));
  };

  const isFavorite = (drinkName: string) => {
    const normalized = drinkName.trim();
    return favorites.map((n) => n.trim()).includes(normalized);
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

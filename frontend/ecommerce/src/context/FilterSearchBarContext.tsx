// context/FilterContext.tsx
import { createContext, useContext, useState } from "react";

interface FilterContextType {
  openBarFilter: boolean;
  toggleBarFilter: () => void;
  onSubmitSearchBar?: (filters: any) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openBarFilter, setOpenBarFilter] = useState(false);
  const toggleBarFilter = () => setOpenBarFilter((prev) => !prev);
  const onSubmitSearchBar = (filters: any) => {
    console.log("Filters submitted - FilterSearchBarContext : ", filters);
    // Implémentez la logique de recherche ici
  };
  console.log("FilterProvider rendered : ", openBarFilter);

  return (
    <FilterContext.Provider
      value={{ openBarFilter, toggleBarFilter, onSubmitSearchBar }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("useFilter must be used within a FilterProvider");
  return context;
};

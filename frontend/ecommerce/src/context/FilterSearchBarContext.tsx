// context/FilterContext.tsx
import { createContext, useContext, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import type { Product } from "../interfaces/product.interface";

interface FilterContextType {
  openBarFilter: boolean;
  toggleBarFilter: () => void;
  onSubmitSearchBar?: (filters: any) => void;
  searchProductsHook: (params: {
    title?: string;
    slug?: string;
  }) => Promise<Product>;
  getProducts: Product[];
  getProductsByCategory: Product[];
  getProductsBySubsCategory: Product[];
  getProductsByAverageRate: Product[];
  getProductsByPriceRange: Product[];
  searchProductsByCategoryIdHook: (categoryId: string) => Promise<Product[]>;
  searchProductsBySubsCategoryIdHook: (
    subsCategoryId: string
  ) => Promise<Product[]>;
  searchProductsByAverageRateHook: (
    minRate: number,
    maxRate: number
  ) => Promise<Product[]>;
  searchProductsByPriceRangeHook: (
    minPrice: number,
    maxPrice: number
  ) => Promise<Product[]>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openBarFilter, setOpenBarFilter] = useState(false);
  const [getProducts, setProducts] = useState([]);
  const [getProductsByCategory, setProductsByCategory] = useState([]);
  const [getProductsBySubsCategory, setProductsBySubsCategory] = useState([]);
  const [getProductsByAverageRate, setProductsByAverageRate] = useState([]);
  const [getProductsByPriceRange, setProductsByPriceRange] = useState([]);
  const {
    searchProductsHook,
    searchProductsByCategoryIdHook,
    searchProductsBySubsCategoryIdHook,
    searchProductsByAverageRateHook,
    searchProductsByPriceRangeHook,
  } = useProduct();
  const toggleBarFilter = () => setOpenBarFilter((prev) => !prev);
  const onSubmitSearchBar = async (filters: any) => {
    console.log("Filters submitted - FilterSearchBarContext : ", filters);
    // Implémentez la logique de recherche ici
    if (filters.title) {
      const result = await searchProductsHook(filters);
      console.log("Search result - FilterSearchBarContext : ", result);
      setProducts(result);
    } else if (filters.categoryId) {
      const resultByCategory = await searchProductsByCategoryIdHook(
        filters.categoryId
      );
      console.log(
        "Search by Category result - FilterSearchBarContext : ",
        resultByCategory
      );
      setProductsByCategory(resultByCategory);
    } else if (filters.subcategoryId) {
      const resultBySubsCategory = await searchProductsBySubsCategoryIdHook(
        filters.subcategoryId
      );
      console.log(
        "Search by Subs Category result - FilterSearchBarContext : ",
        resultBySubsCategory
      );
      setProductsBySubsCategory(resultBySubsCategory);
    } else if (filters.minRate !== 0 && filters.maxRate !== 5) {
      console.log(
        "Filtering by rate with minRate:",
        filters.minRate,
        "and maxRate:",
        filters.maxRate
      );
      const resultByRate = await searchProductsByAverageRateHook(
        filters.minRate,
        filters.maxRate
      );
      console.log(
        "Search by Average Rate result - FilterSearchBarContext : ",
        resultByRate
      );
      setProductsByAverageRate(resultByRate);
    } else if (filters.minPrice !== 0 && filters.maxPrice !== 1500) {
      console.log(
        "Filtering by price with minPrice:",
        filters.minPrice,
        "and maxPrice:",
        filters.maxPrice
      );
      const resultByPrice = await searchProductsByPriceRangeHook(
        filters.minPrice,
        filters.maxPrice
      );
      console.log(
        "Search by Price Range result - FilterSearchBarContext : ",
        resultByPrice
      );
      setProductsByPriceRange(resultByPrice);
    }
  };
  console.log("FilterProvider rendered : ", openBarFilter);
  console.log("Products in FilterProvider : ", getProducts);

  return (
    <FilterContext.Provider
      value={{
        openBarFilter,
        toggleBarFilter,
        onSubmitSearchBar,
        searchProductsHook,
        searchProductsByCategoryIdHook,
        searchProductsBySubsCategoryIdHook,
        searchProductsByAverageRateHook,
        getProductsByCategory,
        getProductsBySubsCategory,
        getProducts,
        getProductsByAverageRate,
        getProductsByPriceRange,
        searchProductsByPriceRangeHook,
      }}
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

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
    // Implement search logic here
    if (filters.title) {
      const result = await searchProductsHook(filters);
      setProducts(result);
    } else if (filters.categoryId) {
      const resultByCategory = await searchProductsByCategoryIdHook(
        filters.categoryId
      );

      setProductsByCategory(resultByCategory);
    } else if (filters.subcategoryId) {
      const resultBySubsCategory = await searchProductsBySubsCategoryIdHook(
        filters.subcategoryId
      );

      setProductsBySubsCategory(resultBySubsCategory);
    } else if (filters.minRate !== 0 && filters.maxRate !== 5) {
      const resultByRate = await searchProductsByAverageRateHook(
        filters.minRate,
        filters.maxRate
      );

      setProductsByAverageRate(resultByRate);
    } else if (filters.minPrice !== 0 && filters.maxPrice !== 1500) {
      const resultByPrice = await searchProductsByPriceRangeHook(
        filters.minPrice,
        filters.maxPrice
      );

      setProductsByPriceRange(resultByPrice);
    }
  };

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

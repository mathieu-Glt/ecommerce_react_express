import React, { useEffect, useState } from "react";
import "./SearchFilterModal.css";
import type { BarFilter } from "../../interfaces/barFilter";
import useCategory from "../../hooks/useCategory";
import useSubCategory from "../../hooks/useSubCategory";

interface SearchFilterDrawerProps extends BarFilter {
  onClose: () => void;
  onSubmit: (filters: any) => void;
  getProducts: any;
}

const SearchFilterDrawer: React.FC<SearchFilterDrawerProps> = ({
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(5);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const { categories, getAllCategories } = useCategory(); // Pour récupérer les catégories
  const { subCategories, getAllSubCategories } = useSubCategory(); // Pour récupérer les sous-catégories
  useEffect(() => {
    getAllCategories();
    getAllSubCategories();
  }, [getAllCategories, getAllSubCategories]);

  const handleSearch = () => {
    onSubmit({
      title,
      minPrice,
      maxPrice,
      minRate,
      maxRate,
      categoryId,
      subcategoryId,
    });
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
      >
        <button className="drawer-close" onClick={onClose}>
          ×
        </button>
        <h2>Product Filters</h2>

        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            placeholder="ex: nike-air-max"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            Prix : {minPrice} € – {maxPrice} €
          </label>
          <input
            type="range"
            min={0}
            max={1500}
            step={10}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input
            type="range"
            min={0}
            max={1500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>
            Rating: {minRate} – {maxRate}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={minRate}
            onChange={(e) => setMinRate(Number(e.target.value))}
          />
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Subcategory</label>
          <select
            value={categoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchFilterDrawer;

import React, { useEffect, useState } from "react";
import "./SearchFilterModal.css";
import type { BarFilter } from "../../interfaces/barFilter";
import useCategory from "../../hooks/useCategory";
import useSubCategory from "../../hooks/useSubCategory";

interface SearchFilterDrawerProps extends BarFilter {
  onClose: () => void;
  onSubmit: (filters: any) => void;
}

const SearchFilterDrawer: React.FC<SearchFilterDrawerProps> = ({
  onClose,
  onSubmit,
}) => {
  const [slug, setSlug] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rateRange, setRateRange] = useState([0, 5]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const { categories, getAllCategories } = useCategory(); // Pour récupérer les catégories
  const { subCategories, getAllSubCategories } = useSubCategory(); // Pour récupérer les sous-catégories
  useEffect(() => {
    getAllCategories();
    getAllSubCategories();
  }, [getAllCategories, getAllSubCategories]);
  console.log("Catégories disponibles :", categories);
  console.log("Sous-catégories disponibles :", subCategories);

  const handleSearch = () => {
    console.log("Filtres :", { slug, priceRange, rateRange, categoryId });
    onSubmit({ slug, priceRange, rateRange, categoryId, subcategoryId });
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()} // empêche la fermeture en cliquant à l'intérieur
      >
        <button className="drawer-close" onClick={onClose}>
          ×
        </button>
        <h2>🔍 Filtres produits</h2>

        <div className="form-group">
          <label>Slug du produit</label>
          <input
            type="text"
            placeholder="ex: nike-air-max"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            Prix : {priceRange[0]} € – {priceRange[1]} €
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>

        <div className="form-group">
          <label>
            Note : {rateRange[0]} – {rateRange[1]}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={rateRange[0]}
            onChange={(e) =>
              setRateRange([Number(e.target.value), rateRange[1]])
            }
          />
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={rateRange[1]}
            onChange={(e) =>
              setRateRange([rateRange[0], Number(e.target.value)])
            }
          />
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Sous-catégorie</label>
          <select
            value={categoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
          >
            <option value="">Toutes les sous catégories</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default SearchFilterDrawer;

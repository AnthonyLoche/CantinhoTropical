// src/app/components/ui/SearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchProductsAction } from "@/modules/products/actions/search-products.action";
import styles from "@/assets/css/ui/SearchBar.module.css";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        setIsOpen(true);
        const result = await searchProductsAction(searchTerm);
        if (result.success) {
          setResults(result.data);
        }
        setIsLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar produtos..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
        />
        {searchTerm && (
          <button className={styles.clearBtn} onClick={handleClear}>
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.resultsDropdown}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <span>Buscando...</span>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            <ul className={styles.resultsList}>
              {results.map((product) => (
                <li key={product.id} className={styles.resultItem}>
                  <Link
                    href={`/product/${product.id}`}
                    className={styles.resultLink}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={styles.resultImage}>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>📷</div>
                      )}
                    </div>
                    <div className={styles.resultInfo}>
                      <h4 className={styles.resultName}>{product.name}</h4>
                      <span className={styles.resultCategory}>
                        {product.category?.name}
                      </span>
                      <span className={styles.resultPrice}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
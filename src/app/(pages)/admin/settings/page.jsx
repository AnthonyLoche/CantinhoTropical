"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ShoppingBag,
  FolderTree,
  Tag,
  Award,
} from "lucide-react";
import styles from "../../../../assets/css/admin/dashboard.module.css";
import { useSession } from "next-auth/react";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";

export default function DashboardClient() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products (assuming no pagination returns all)
        const productsResult = await getProductsAction({});
        // Fetch all categories
        const categoriesResult = await getCategoriesAction({});
        // Fetch all brands
        const brandsResult = await getBrandsAction({});

        if (productsResult.success) {
          setProducts(productsResult.data);
        }
        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }
        if (brandsResult.success) {
          setBrands(brandsResult.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalBrands = brands.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const latest5Products = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Bem-vindo de volta, {session.user?.name || "Administrador"}
          </p>
        </div>
        <div className={styles.headerDate}>
          <span>
            {new Date().toLocaleDateString("pt-PT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(44, 105, 78, 0.1)", color: "#2c694e" }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className={styles.statValue}>{totalProducts}</p>
            <p className={styles.statTitle}>Total de Produtos</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(1, 38, 31, 0.1)", color: "#01261f" }}
          >
            <FolderTree size={24} />
          </div>
          <div>
            <p className={styles.statValue}>{totalCategories}</p>
            <p className={styles.statTitle}>Total de Categorias</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(131, 166, 156, 0.1)", color: "#83a69c" }}
          >
            <Tag size={24} />
          </div>
          <div>
            <p className={styles.statValue}>{totalBrands}</p>
            <p className={styles.statTitle}>Total de Marcas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(44, 105, 78, 0.1)", color: "#2c694e" }}
          >
            <Award size={24} />
          </div>
          <div>
            <p className={styles.statValue}>{featuredProducts}</p>
            <p className={styles.statTitle}>Produtos em Destaque</p>
          </div>
        </div>
      </div>

      {/* Latest Products */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <Calendar size={18} />
            Últimos 5 produtos cadastrados
          </h3>
        </div>
        <div className={styles.tableWrapper}>
          {latest5Products.length === 0 ? (
            <p className={styles.empty}>Nenhum produto cadastrado.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {latest5Products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>R$ {product.price?.toFixed(2) || "0,00"}</td>
                    <td>{product.stock}</td>
                    <td>
                      {brands.find((b) => b.id === product.brandId)?.name || "-"}
                    </td>
                    <td>
                      {categories.find((c) => c.id === product.categoryId)?.name ||
                        "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
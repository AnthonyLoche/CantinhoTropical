"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ShoppingBag,
  FolderTree,
  Tag,
  Award,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  LayoutDashboard,
  ChevronRight,
  ArrowRight,
  PlusCircle,
  List,
  RefreshCw,
} from "lucide-react";
import styles from "../../../../assets/css/admin/dashboard.module.css";
import { useSession } from "next-auth/react";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";
import Link from "next/link";

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
        const [productsResult, categoriesResult, brandsResult] = await Promise.all([
          getProductsAction({}),
          getCategoriesAction({}),
          getBrandsAction({}),
        ]);

        if (productsResult.success) setProducts(productsResult.data);
        if (categoriesResult.success) setCategories(categoriesResult.data);
        if (brandsResult.success) setBrands(brandsResult.data);
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
  const totalStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const avgPrice = products.length > 0 
    ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length 
    : 0;

  const latest5Products = [...products]
    .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
    .slice(0, 5);

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "#2c694e",
      bgColor: "rgba(44, 105, 78, 0.1)",
      trend: "+12% este mês",
      link: "/admin/products",
    },
    {
      title: "Produtos em Destaque",
      value: featuredProducts.toLocaleString(),
      icon: Award,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      trend: featuredProducts > 0 ? `${Math.round((featuredProducts / totalProducts) * 100)}% do total` : "0% do total",
      link: "/admin/products",
    },
    {
      title: "Estoque Total",
      value: totalStock.toLocaleString(),
      icon: ShoppingBag,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      trend: "unidades em estoque",
      link: "/admin/products",
    },
    {
      title: "Preço Médio",
      value: `R$ ${avgPrice.toFixed(2)}`,
      icon: DollarSign,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      trend: "médio por produto",
      link: "/admin/products",
    },
    {
      title: "Categorias",
      value: totalCategories.toLocaleString(),
      icon: FolderTree,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      trend: `${categories.filter(c => c.products?.length > 0).length} com produtos`,
      link: "/admin/categories",
    },
    {
      title: "Marcas",
      value: totalBrands.toLocaleString(),
      icon: Tag,
      color: "#ec489a",
      bgColor: "rgba(236, 72, 153, 0.1)",
      trend: `${brands.filter(b => b.products?.length > 0).length} com produtos`,
      link: "/admin/brands",
    },
  ];

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <LayoutDashboard size={12} /> Admin
            <ChevronRight size={10} /> Dashboard
          </div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Bem-vindo de volta, {session?.user?.name || "Administrador"}!
          </p>
        </div>
        <div className={styles.headerDate}>
          <Calendar size={14} />
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

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Ações Rápidas</h3>
        <div className={styles.actionGrid}>
          <Link href="/admin/products/new" className={styles.actionCard}>
            <PlusCircle size={20} />
            <span>Novo Produto</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
          <Link href="/admin/categories/new" className={styles.actionCard}>
            <FolderTree size={20} />
            <span>Nova Categoria</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
          <Link href="/admin/brands/new" className={styles.actionCard}>
            <Tag size={20} />
            <span>Nova Marca</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
          <Link href="/admin/products" className={styles.actionCard}>
            <List size={20} />
            <span>Ver Todos os Produtos</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Link href={stat.link} key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTitle}>{stat.title}</p>
              <p className={styles.statTrend}>{stat.trend}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Latest Products Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <Calendar size={18} />
            Últimos Produtos Cadastrados
          </h3>
          <Link href="/admin/products" className={styles.cardLink}>
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.tableWrapper}>
          {latest5Products.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={48} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>Nenhum produto cadastrado</p>
              <p className={styles.emptySubtitle}>Clique em Novo Produto para começar</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {latest5Products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className={styles.productThumb}
                          />
                        ) : (
                          <div className={styles.thumbPlaceholder}>
                            <Package size={16} />
                          </div>
                        )}
                        <div>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productId}>
                            #{product.id?.toString().slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.priceCell}>R$ {product.price?.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.stockChip} ${product.stockQuantity <= 5 ? styles.lowStock : ''}`}>
                        {product.stockQuantity} unid.
                      </span>
                    </td>
                    <td>{brands.find((b) => b.id === product.brandId)?.name || "-"}</td>
                    <td>{categories.find((c) => c.id === product.categoryId)?.name || "-"}</td>
                    <td>
                      <span className={`${styles.statusChip} ${product.active ? styles.activeStatus : styles.inactiveStatus}`}>
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className={styles.footerInfo}>
        <p className={styles.footerText}>
          Total de {totalProducts} produtos cadastrados • 
          {categories.filter(c => c.products?.length > 0).length} categorias com produtos • 
          {brands.filter(b => b.products?.length > 0).length} marcas com produtos
        </p>
      </div>
    </div>
  );
}
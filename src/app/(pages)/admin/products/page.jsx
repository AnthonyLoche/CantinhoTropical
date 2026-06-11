"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  LayoutDashboard,
  ChevronRight as ChevronRightIcon,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import NextImage from "next/image";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { createProductAction } from "@/modules/products/actions/create-product.action";
import { updateProductAction } from "@/modules/products/actions/update-product.action";
import { deleteProductAction } from "@/modules/products/actions/delete-product.action";
import { uploadImageAction } from "@/modules/uploads/actions/upload-image.action";
import { deleteImageAction } from "@/modules/uploads/actions/delete-image.action";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { MetricsGrid } from "@/app/components";
import ProductModal from "@/app/components/admin/ProductModal";
import ProductFilters from "@/app/components/admin/ProductFilters";
import styles from "@/assets/css/admin/products.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    status: "all",
    featured: undefined,
    stockRange: "all",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      brandId: "",
      categoryId: "",
      active: true,
      featured: false,
      oldImage: "",
      hint: "",
      howUse: "",
      ingredients: "",
      variants: [],
    },
  });

  const watchedImage = watch("image");
  const formId = watch("id");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
    const featuredProducts = products.filter((p) => p.featured).length;
    const avgPrice = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length 
      : 0;

    return [
      {
        title: "Total de Produtos",
        value: totalProducts.toLocaleString(),
        icon: <Package size={28} />,
        color: "#2c694e",
        bgColor: "rgba(44, 105, 78, 0.1)",
      },
      {
        title: "Estoque Total",
        value: totalStock.toLocaleString(),
        icon: <ShoppingCart size={28} />,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        title: "Produtos em Destaque",
        value: featuredProducts.toLocaleString(),
        icon: <TrendingUp size={28} />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        title: "Preço Médio",
        value: `€ ${avgPrice.toFixed(2)}`,
        icon: <DollarSign size={28} />,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
    ];
  }, [products]);

  // Aplicar filtros nos produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.id?.toString().includes(searchLower) ||
          product.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categorias
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.categories.includes(product.categoryId)
      );
    }

    // Filtro por marcas
    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.brands.includes(product.brandId)
      );
    }

    // Filtro por status
    if (selectedFilters.status === "active") {
      filtered = filtered.filter((product) => product.active === true);
    } else if (selectedFilters.status === "inactive") {
      filtered = filtered.filter((product) => product.active === false);
    }

    // Filtro por destaque
    if (selectedFilters.featured === true) {
      filtered = filtered.filter((product) => product.featured === true);
    } else if (selectedFilters.featured === false) {
      filtered = filtered.filter((product) => product.featured === false);
    }

    // Filtro por estoque
    if (selectedFilters.stockRange === "low") {
      filtered = filtered.filter((product) => product.stockQuantity <= 5 && product.stockQuantity > 0);
    } else if (selectedFilters.stockRange === "out") {
      filtered = filtered.filter((product) => product.stockQuantity === 0);
    } else if (selectedFilters.stockRange === "in") {
      filtered = filtered.filter((product) => product.stockQuantity > 0);
    }

    return filtered;
  }, [products, search, selectedFilters]);

  // Paginação
  const pageCount = useMemo(() => {
    if (itemsPerPage === -1) return 1;
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  const paginatedProducts = useMemo(() => {
    if (itemsPerPage === -1) return filteredProducts;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, itemsPerPage]);

  const paginationText = useMemo(() => {
    if (filteredProducts.length === 0) return "0 produtos";
    if (itemsPerPage === -1) return `${filteredProducts.length} produtos`;
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, filteredProducts.length);
    return `${start}-${end} de ${filteredProducts.length} produtos`;
  }, [filteredProducts, page, itemsPerPage]);

  // Fetch data
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getProductsAction({ includeVariants: true });
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const result = await getBrandsAction();
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategoriesAction();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmitForm = async (data) => {
    if (data.id) {
      await handleSubmitEdit(data);
    } else {
      await handleSubmitCreate(data);
    }
  };

  const handleSubmitCreate = async (data) => {
    try {
      let imageUrl = "";
      
      // Se tem um arquivo de imagem, faz upload primeiro
      if (data.image instanceof File) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("type", "product");
        
        const uploadResult = await uploadImageAction(formData);
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        } else {
          throw new Error(uploadResult.error);
        }
        setUploading(false);
      } else if (typeof data.image === 'string' && data.image.trim() !== '') {
        // Já é uma URL (caso de edição sem alterar imagem)
        imageUrl = data.image;
      } else {
        throw new Error("Selecione uma imagem para o produto");
      }

      const variants = (data.variants || [])
        .filter(v => v.label && v.label.trim() !== '')
        .map(v => ({
          label: v.label.trim(),
          quantity: parseInt(v.quantity) || 0,
          price: parseFloat(v.price) || 0,
        }));

      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stock),
        image: imageUrl, // Agora é string, não File
        active: data.active === true || data.active === "true",
        featured: data.featured === true || data.featured === "true",
        brandId: data.brandId,
        categoryId: data.categoryId,
        hint: data.hint || "",
        howUse: data.howUse || "",
        ingredients: data.ingredients || "",
        variants: variants,
      };

      const result = await createProductAction(productData);
      if (result.success) {
        resetForm();
        fetchProducts();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.message);
    }
  };

  const handleSubmitEdit = async (data) => {
    try {
      let imageUrl = data.oldImage || "";
      
      // Se tem um novo arquivo de imagem, faz upload
      if (data.image instanceof File) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("type", "product");
        
        const uploadResult = await uploadImageAction(formData);
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
          // Deleta a imagem antiga se existir e for diferente da nova
          if (data.oldImage && data.oldImage !== imageUrl) {
            await deleteImageAction({ url: data.oldImage });
          }
        } else {
          throw new Error(uploadResult.error);
        }
        setUploading(false);
      } else if (typeof data.image === 'string' && data.image.trim() !== '') {
        // Mantém a imagem existente (já é URL)
        imageUrl = data.image;
      }

      const variants = (data.variants || [])
        .filter(v => v.label && v.label.trim() !== '')
        .map(v => ({
          id: v.id,
          label: v.label.trim(),
          quantity: parseInt(v.quantity) || 0,
          price: parseFloat(v.price) || 0,
        }));

      const productData = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stock),
        image: imageUrl,
        active: data.active === true || data.active === "true",
        featured: data.featured === true || data.featured === "true",
        brandId: data.brandId,
        categoryId: data.categoryId,
        hint: data.hint || "",
        howUse: data.howUse || "",
        ingredients: data.ingredients || "",
        variants: variants,
      };

      const result = await updateProductAction(productData);
      if (result.success) {
        resetForm();
        fetchProducts();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    setDeletingId(id);
    try {
      const result = await deleteProductAction({ id });
      if (result.success) {
        fetchProducts();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = (file) => {
  setValue("image", file);
};


  const resetForm = () => {
    reset({
      id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      brandId: "",
      categoryId: "",
      active: true,
      featured: false,
      oldImage: "",
      hint: "",
      howUse: "",
      ingredients: "",
      variants: [],
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    const variantsArray = Array.isArray(product.variants) ? product.variants : [];
    
    reset({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stockQuantity?.toString() || product.stock?.toString() || "",
      image: product.imageUrl || product.image || "",
      brandId: product.brandId || "",
      categoryId: product.categoryId || "",
      active: product.active,
      featured: product.featured,
      oldImage: product.imageUrl || product.image || "",
      hint: product.hint || "",
      howUse: product.howUse || "",
      ingredients: product.ingredients || "",
      variants: variantsArray.map(v => ({
        id: v.id,
        label: v.label,
        quantity: v.quantity,
        price: v.price,
      })),
    });
    setIsModalOpen(true);
  };

  const itemsPerPageOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: -1, label: "Todos" },
  ];

  const handleExport = () => {
    const csvData = filteredProducts.map(p => ({
      ID: p.id,
      Nome: p.name,
      Preço: p.price,
      Estoque: p.stockQuantity,
      Marca: brands.find(b => b.id === p.brandId)?.name || '',
      Categoria: categories.find(c => c.id === p.categoryId)?.name || '',
      Ativo: p.active ? 'Sim' : 'Não',
      Destaque: p.featured ? 'Sim' : 'Não'
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produtos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      status: "all",
      featured: undefined,
      stockRange: "all",
    });
    setPage(1);
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedFilters.categories.length) count += selectedFilters.categories.length;
    if (selectedFilters.brands.length) count += selectedFilters.brands.length;
    if (selectedFilters.status !== "all") count++;
    if (selectedFilters.featured !== undefined) count++;
    if (selectedFilters.stockRange !== "all") count++;
    return count;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumb}>
              <LayoutDashboard size={12} /> Admin
              <ChevronRightIcon size={10} /> Produtos
            </div>
            <h1 className={styles.title}>Produtos</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton} disabled>
              <Download size={16} /> Exportar
            </button>
            <button className={styles.primaryButton} disabled>
              <Plus size={16} /> Novo Produto
            </button>
          </div>
        </div>
        <MetricsGrid metrics={metrics} />
        <div className={styles.toolbar}>
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="Pesquisar..." className={styles.searchInput} disabled />
          </div>
          <button className={styles.filterButton} disabled><Filter size={15} /> Filtros</button>
          <button className={styles.filterButton} disabled><ArrowUpDown size={15} /> Ordenar</button>
        </div>
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonCell} style={{ width: "50px" }}></div>
              <div className={styles.skeletonCell} style={{ flex: 2 }}></div>
              <div className={styles.skeletonCell} style={{ width: "100px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "80px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "120px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "120px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "60px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "80px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "80px" }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <LayoutDashboard size={12} /> Admin
            <ChevronRightIcon size={10} /> Produtos
          </div>
          <h1 className={styles.title}>Produtos</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={handleExport}>
            <Download size={16} /> Exportar
          </button>
          <button className={styles.primaryButton} onClick={openCreateModal}>
            <Plus size={16} /> Novo Produto
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsGrid metrics={metrics} />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar por nome, ID ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button 
          className={styles.filterButton} 
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <Filter size={15} /> 
          Filtros
          {activeFiltersCount() > 0 && (
            <span className={styles.activeFilterBadge}>{activeFiltersCount()}</span>
          )}
        </button>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className={styles.emptyContainer}>
          <Package size={80} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Nenhum produto encontrado</p>
          <p className={styles.emptySubtitle}>
            {search || activeFiltersCount() > 0 ? "Tente uma busca diferente ou remova os filtros" : "Clique em 'Novo Produto' para adicionar"}
          </p>
        </div>
      )}

      {/* Products Table */}
      {filteredProducts.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell} style={{ width: "80px" }}>Imagem</th>
                  <th className={styles.tableHeaderCell}>Nome</th>
                  <th className={styles.tableHeaderCell} style={{ width: "100px" }}>Preço</th>
                  <th className={styles.tableHeaderCell} style={{ width: "80px" }}>Estoque</th>
                  <th className={styles.tableHeaderCell} style={{ width: "120px" }}>Marca</th>
                  <th className={styles.tableHeaderCell} style={{ width: "120px" }}>Categoria</th>
                  <th className={styles.tableHeaderCell} style={{ width: "70px" }}>Ativo</th>
                  <th className={styles.tableHeaderCell} style={{ width: "80px" }}>Destaque</th>
                  <th className={styles.tableHeaderCell} style={{ width: "80px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {product.imageUrl ? (
                        <NextImage
                          src={product.imageUrl}
                          alt={product.name}
                          width={38}
                          height={38}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.productCell}>
                        <div>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productId}>#{product.id?.toString().slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.priceText}>€ {product.price?.toFixed(2)}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={product.stockQuantity <= 5 ? styles.lowStock : ""}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.brandChip}>
                        {brands.find((b) => b.id === product.brandId)?.name || "-"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.categoryChip}>
                        {categories.find((c) => c.id === product.categoryId)?.name || "-"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusChip} ${product.active ? styles.activeStatus : styles.inactiveStatus}`}>
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {product.featured && <span className={styles.featuredChip}>Destaque</span>}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => openEditModal(product)} title="Editar">
                          <Edit size={14} />
                        </button>
                        <button className={styles.deleteButton} disabled={deletingId === product.id} onClick={() => handleDelete(product.id)} title="Excluir">
                          {deletingId === product.id ? <div className={styles.spinner} /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.footerLeft}>
              <span className={styles.paginationText}>{paginationText}</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
                className={styles.itemsPerPageSelect}
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.footerRight}>
              <button onClick={() => setPage(1)} disabled={page === 1} className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ""}`}>
                <ChevronsLeft size={16} />
              </button>
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ""}`}>
                <ChevronLeft size={16} />
              </button>
              <div className={styles.pageNumbers}>
                {[...Array(Math.min(5, pageCount))].map((_, i) => {
                  let pageNum;
                  if (pageCount <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= pageCount - 2) pageNum = pageCount - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`${styles.pageNumber} ${page === pageNum ? styles.activePage : ""}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPage(page + 1)} disabled={page === pageCount} className={`${styles.paginationButton} ${page === pageCount ? styles.disabled : ""}`}>
                <ChevronRight size={16} />
              </button>
              <button onClick={() => setPage(pageCount)} disabled={page === pageCount} className={`${styles.paginationButton} ${page === pageCount ? styles.disabled : ""}`}>
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formId={formId}
        register={register}
        errors={errors}
        control={control}
        watchedImage={watchedImage}
        brands={brands}
        categories={categories}
        isSubmitting={isSubmitting}
        uploading={uploading}
        handleSubmit={handleSubmit}
        onSubmit={handleSubmitForm}
        onFileChange={handleFileChange}
      />

      {/* Product Filters Drawer */}
      <ProductFilters
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        brands={brands}
        categories={categories}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
      />
    </div>
  );
}
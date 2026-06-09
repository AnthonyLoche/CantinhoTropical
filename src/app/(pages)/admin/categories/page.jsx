"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FolderTree,
  Folder,
  FileText,
  Image as LucideImage,
  ImageOff,
  LayoutDashboard,
  ChevronRight as ChevronRightIcon,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import NextImage from "next/image";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { createCategoryAction } from "@/modules/categories/actions/create-category.action";
import { updateCategoryAction } from "@/modules/categories/actions/update-category.action";
import { deleteCategoryAction } from "@/modules/categories/actions/delete-category.action";
import { uploadImageAction } from "@/modules/uploads/actions/upload-image.action";
import { deleteImageAction } from "@/modules/uploads/actions/delete-image.action";
import MetricsGrid from "@/app/components/ui/MetricsGrid";
import styles from "@/assets/css/admin/categories.module.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      image: "",
      oldImage: "",
    },
  });

  const watchedImage = watch("image");
  const formId = watch("id");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalCategories = categories.length;
    const categoriesWithDescription = categories.filter((c) => c.description && c.description.trim() !== "").length;
    const categoriesWithImage = categories.filter((c) => c.imageUrl).length;

    return [
      {
        title: "Total de Categorias",
        value: totalCategories.toLocaleString(),
        icon: <Folder size={28} />,
        color: "#2c694e",
        bgColor: "rgba(44, 105, 78, 0.1)",
      },
      {
        title: "Com Descrição",
        value: categoriesWithDescription.toLocaleString(),
        icon: <FileText size={28} />,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        title: "Com Imagem",
        value: categoriesWithImage.toLocaleString(),
        icon: <LucideImage size={28} />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        title: "Sem Imagem",
        value: (totalCategories - categoriesWithImage).toLocaleString(),
        icon: <ImageOff size={28} />,
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
      },
    ];
  }, [categories]);

  // Paginação
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const searchLower = search.toLowerCase();
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchLower) ||
        category.id?.toString().includes(searchLower)
    );
  }, [categories, search]);

  const pageCount = useMemo(() => {
    if (itemsPerPage === -1) return 1;
    return Math.ceil(filteredCategories.length / itemsPerPage);
  }, [filteredCategories, itemsPerPage]);

  const paginatedCategories = useMemo(() => {
    if (itemsPerPage === -1) return filteredCategories;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, page, itemsPerPage]);

  const paginationText = useMemo(() => {
    if (filteredCategories.length === 0) return "0 categorias";
    if (itemsPerPage === -1) return `${filteredCategories.length} categorias`;
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, filteredCategories.length);
    return `${start}-${end} de ${filteredCategories.length} categorias`;
  }, [filteredCategories, page, itemsPerPage]);

  // Fetch data
  useEffect(() => {
    fetchCategories();
  }, [search]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategoriesAction({ search });
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
      let imageUrl = data.image;
      
      if (data.image instanceof File) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("type", "category");
        const uploadResult = await uploadImageAction(formData);
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        } else {
          throw new Error(uploadResult.error);
        }
        setUploading(false);
      }

      const categoryData = {
        name: data.name,
        description: data.description,
        image: imageUrl,
      };

      const result = await createCategoryAction(categoryData);
      if (result.success) {
        resetForm();
        fetchCategories();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert(error.message);
    }
  };

  const handleSubmitEdit = async (data) => {
    try {
      let imageUrl = data.image;
      
      if (data.image instanceof File) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("type", "category");
        const uploadResult = await uploadImageAction(formData);
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
          if (data.oldImage) {
            await deleteImageAction({ url: data.oldImage });
          }
        } else {
          throw new Error(uploadResult.error);
        }
        setUploading(false);
      }

      const categoryData = {
        id: data.id,
        name: data.name,
        description: data.description,
        image: imageUrl,
      };

      const result = await updateCategoryAction(categoryData);
      if (result.success) {
        resetForm();
        fetchCategories();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    setDeletingId(id);
    try {
      const result = await deleteCategoryAction({ id });
      if (result.success) {
        fetchCategories();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    reset({
      id: "",
      name: "",
      description: "",
      image: "",
      oldImage: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    reset({
      id: category.id,
      name: category.name,
      description: category.description || "",
      image: category.imageUrl || category.image || "",
      oldImage: category.imageUrl || category.image || "",
    });
    setIsModalOpen(true);
  };

  // Função para exportar dados
  const handleExport = () => {
    const csvData = categories.map(c => ({
      ID: c.id,
      Nome: c.name,
      Descrição: c.description || '',
      'URL da Imagem': c.imageUrl || '',
      'Produtos Vinculados': c._count?.products || 0
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `categorias_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const itemsPerPageOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: -1, label: "Todos" },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumb}>
              <LayoutDashboard size={12} /> Admin
              <ChevronRightIcon size={10} /> Categorias
            </div>
            <h1 className={styles.title}>Categorias</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton} disabled>
              <Download size={16} /> Exportar
            </button>
            <button className={styles.primaryButton} disabled>
              <Plus size={16} /> Nova Categoria
            </button>
          </div>
        </div>
        <MetricsGrid metrics={metrics} />
        <div className={styles.toolbar}>
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar por nome ou ID..."
              className={styles.searchInput}
              disabled
            />
          </div>
          <button className={styles.filterButton} disabled>
            <Filter size={15} /> Filtros
          </button>
          <button className={styles.filterButton} disabled>
            <ArrowUpDown size={15} /> Ordenar
          </button>
        </div>
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonCell} style={{ width: "60px" }}></div>
              <div className={styles.skeletonCell} style={{ flex: 1 }}></div>
              <div className={styles.skeletonCell} style={{ flex: 2 }}></div>
              <div className={styles.skeletonCell} style={{ width: "100px" }}></div>
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
            <ChevronRightIcon size={10} /> Categorias
          </div>
          <h1 className={styles.title}>Categorias</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={handleExport}>
            <Download size={16} /> Exportar
          </button>
          <button className={styles.primaryButton} onClick={openCreateModal}>
            <Plus size={16} /> Nova Categoria
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
            placeholder="Pesquisar por nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredCategories.length === 0 && (
        <div className={styles.emptyContainer}>
          <FolderTree size={80} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Nenhuma categoria encontrada</p>
          <p className={styles.emptySubtitle}>
            {search ? "Tente uma busca diferente" : "Clique em 'Nova Categoria' para adicionar"}
          </p>
        </div>
      )}

      {/* Categories Table */}
      {!loading && filteredCategories.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell} style={{ width: "70px" }}>Imagem</th>
                  <th className={styles.tableHeaderCell}>Nome</th>
                  <th className={styles.tableHeaderCell}>Descrição</th>
                  <th className={styles.tableHeaderCell} style={{ width: "100px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {category.imageUrl ? (
                        <NextImage
                          src={category.imageUrl}
                          alt={category.name}
                          width={38}
                          height={38}
                          className={styles.categoryImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.categoryCell}>
                        <div>
                          <div className={styles.categoryName}>{category.name}</div>
                          <div className={styles.categoryId}>
                            #{category.id?.toString().toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.categoryDescription}>
                        {category.description || "-"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => openEditModal(category)}
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          disabled={deletingId === category.id}
                          onClick={() => handleDelete(category.id)}
                          title="Excluir"
                        >
                          {deletingId === category.id ? (
                            <div className={styles.spinner} />
                          ) : (
                            <Trash2 size={14} />
                          )}
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
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ""}`}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ""}`}
              >
                <ChevronLeft size={16} />
              </button>

              <div className={styles.pageNumbers}>
                {[...Array(Math.min(5, pageCount))].map((_, i) => {
                  let pageNum;
                  if (pageCount <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pageCount - 2) {
                    pageNum = pageCount - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`${styles.pageNumber} ${page === pageNum ? styles.activePage : ""}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pageCount}
                className={`${styles.paginationButton} ${page === pageCount ? styles.disabled : ""}`}
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage(pageCount)}
                disabled={page === pageCount}
                className={`${styles.paginationButton} ${page === pageCount ? styles.disabled : ""}`}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {formId ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.modalForm}>
              <div className={styles.formFields}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Nome</label>
                  <input
                    type="text"
                    className={`${styles.formInput} ${errors.name ? styles.error : ""}`}
                    {...register("name", { required: "Nome é obrigatório" })}
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Descrição</label>
                  <textarea
                    rows={3}
                    className={`${styles.formTextarea} ${errors.description ? styles.error : ""}`}
                    {...register("description")}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Imagem da Categoria</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => setValue("image", e.target.files[0])}
                  />
                  {errors.image && <span className={styles.errorMessage}>{errors.image.message}</span>}
                  {watchedImage && watchedImage instanceof File && (
                    <p className={styles.fileInfo}>
                      {watchedImage.name} ({(watchedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {typeof watchedImage === "string" && watchedImage && (
                    <div className={styles.imagePreview}>
                      <NextImage
                        src={watchedImage}
                        alt="Preview"
                        width={60}
                        height={60}
                        className={styles.previewImage}
                      />
                      <span>Imagem atual</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton} disabled={isSubmitting || uploading}>
                  {isSubmitting || uploading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
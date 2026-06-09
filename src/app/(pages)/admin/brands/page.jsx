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
  Tag,
  Building2,
  Image as LucideImage,
  ImageOff,
  Trophy,
  LayoutDashboard,
  ChevronRight as ChevronRightIcon,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import NextImage from "next/image";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";
import { createBrandAction } from "@/modules/brands/actions/create-brand.action";
import { updateBrandAction } from "@/modules/brands/actions/update-brand.action";
import { deleteBrandAction } from "@/modules/brands/actions/delete-brand.action";
import { uploadImageAction } from "@/modules/uploads/actions/upload-image.action";
import { deleteImageAction } from "@/modules/uploads/actions/delete-image.action";
import MetricsGrid from "@/app/components/ui/MetricsGrid";
import styles from "@/assets/css/admin/brands.module.css";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
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
      image: "",
      oldImage: "",
    },
  });

  const watchedImage = watch("image");
  const formId = watch("id");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalBrands = brands.length;
    const brandsWithImage = brands.filter((b) => b.imageUrl).length;

    return [
      {
        title: "Total de Marcas",
        value: totalBrands.toLocaleString(),
        icon: <Building2 size={28} />,
        color: "#2c694e",
        bgColor: "rgba(44, 105, 78, 0.1)",
      },
      {
        title: "Com Imagem",
        value: brandsWithImage.toLocaleString(),
        icon: <LucideImage size={28} />,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        title: "Sem Imagem",
        value: (totalBrands - brandsWithImage).toLocaleString(),
        icon: <ImageOff size={28} />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        title: "Produtos por Marca",
        value: totalBrands > 0 ? (brands.reduce((sum, b) => sum + (b._count?.products || 0), 0) / totalBrands).toFixed(1) : "0",
        icon: <Trophy size={28} />,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
    ];
  }, [brands]);

  // Paginação
  const filteredBrands = useMemo(() => {
    if (!search) return brands;
    const searchLower = search.toLowerCase();
    return brands.filter(
      (brand) =>
        brand.name?.toLowerCase().includes(searchLower) ||
        brand.id?.toString().includes(searchLower)
    );
  }, [brands, search]);

  const pageCount = useMemo(() => {
    if (itemsPerPage === -1) return 1;
    return Math.ceil(filteredBrands.length / itemsPerPage);
  }, [filteredBrands, itemsPerPage]);

  const paginatedBrands = useMemo(() => {
    if (itemsPerPage === -1) return filteredBrands;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBrands.slice(start, end);
  }, [filteredBrands, page, itemsPerPage]);

  const paginationText = useMemo(() => {
    if (filteredBrands.length === 0) return "0 marcas";
    if (itemsPerPage === -1) return `${filteredBrands.length} marcas`;
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, filteredBrands.length);
    return `${start}-${end} de ${filteredBrands.length} marcas`;
  }, [filteredBrands, page, itemsPerPage]);

  // Fetch data
  useEffect(() => {
    fetchBrands();
  }, [search]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const result = await getBrandsAction({ search });
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
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
        formData.append("type", "brand");
        const uploadResult = await uploadImageAction(formData);
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
        } else {
          throw new Error(uploadResult.error);
        }
        setUploading(false);
      }

      const brandData = {
        name: data.name,
        image: imageUrl,
      };

      const result = await createBrandAction(brandData);
      if (result.success) {
        resetForm();
        fetchBrands();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating brand:", error);
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
        formData.append("type", "brand");
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

      const brandData = {
        id: data.id,
        name: data.name,
        image: imageUrl,
      };

      const result = await updateBrandAction(brandData);
      if (result.success) {
        resetForm();
        fetchBrands();
        setIsModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta marca?")) return;
    setDeletingId(id);
    try {
      const result = await deleteBrandAction({ id });
      if (result.success) {
        fetchBrands();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    reset({
      id: "",
      name: "",
      image: "",
      oldImage: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    reset({
      id: brand.id,
      name: brand.name,
      image: brand.imageUrl || brand.image || "",
      oldImage: brand.imageUrl || brand.image || "",
    });
    setIsModalOpen(true);
  };

  // Função para exportar dados
  const handleExport = () => {
    const csvData = brands.map(b => ({
      ID: b.id,
      Nome: b.name,
      'URL da Imagem': b.imageUrl || '',
      'Produtos Vinculados': b._count?.products || 0
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marcas_${new Date().toISOString().split('T')[0]}.csv`;
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
              <ChevronRightIcon size={10} /> Marcas
            </div>
            <h1 className={styles.title}>Marcas</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton} disabled>
              <Download size={16} /> Exportar
            </button>
            <button className={styles.primaryButton} disabled>
              <Plus size={16} /> Nova Marca
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
        </div>
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonCell} style={{ width: "60px" }}></div>
              <div className={styles.skeletonCell} style={{ flex: 1 }}></div>
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
            <ChevronRightIcon size={10} /> Marcas
          </div>
          <h1 className={styles.title}>Marcas</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={handleExport}>
            <Download size={16} /> Exportar
          </button>
          <button className={styles.primaryButton} onClick={openCreateModal}>
            <Plus size={16} /> Nova Marca
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
        <button className={styles.filterButton}>
          <Filter size={15} /> Filtros
        </button>
        <button className={styles.filterButton}>
          <ArrowUpDown size={15} /> Ordenar
        </button>
      </div>

      {/* Empty State */}
      {!loading && filteredBrands.length === 0 && (
        <div className={styles.emptyContainer}>
          <Tag size={80} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Nenhuma marca encontrada</p>
          <p className={styles.emptySubtitle}>
            {search ? "Tente uma busca diferente" : "Clique em 'Nova Marca' para adicionar"}
          </p>
        </div>
      )}

      {/* Brands Table */}
      {!loading && filteredBrands.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell} style={{ width: "70px" }}>Imagem</th>
                  <th className={styles.tableHeaderCell}>Nome</th>
                  <th className={styles.tableHeaderCell} style={{ width: "100px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBrands.map((brand) => (
                  <tr key={brand.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {brand.imageUrl ? (
                        <NextImage
                          src={brand.imageUrl}
                          alt={brand.name}
                          width={38}
                          height={38}
                          className={styles.brandImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.brandCell}>
                        <div>
                          <div className={styles.brandName}>{brand.name}</div>
                          <div className={styles.brandId}>
                            #{brand.id?.toString().slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => openEditModal(brand)}
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          disabled={deletingId === brand.id}
                          onClick={() => handleDelete(brand.id)}
                          title="Excluir"
                        >
                          {deletingId === brand.id ? (
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
                {formId ? "Editar Marca" : "Nova Marca"}
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
                  <label className={styles.formLabel}>Imagem da Marca</label>
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
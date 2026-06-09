"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  User,
  Mail,
  Calendar,
  LayoutDashboard,
  ChevronRight as ChevronRightIcon,
  Download,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import styles from "@/assets/css/admin/users.module.css";
import { useSession } from "next-auth/react";
import { getUsersAction } from "@/modules/users/actions/get-users.action";
import { createUserAction } from "@/modules/users/actions/create-user.action";
import { updateUserAction } from "@/modules/users/actions/update-user.action";
import { deleteUserAction } from "@/modules/users/actions/delete-user.action";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formId = watch("id");
  const passwordValue = watch("password");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalUsers = users.length;

    return [
      {
        title: "Total de Usuários",
        value: totalUsers.toLocaleString(),
        icon: <Users size={28} />,
        color: "#2c694e",
        bgColor: "rgba(44, 105, 78, 0.1)",
      },
      {
        title: "Administradores",
        value: totalUsers.toLocaleString(),
        icon: <User size={28} />,
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        title: "Total de Contas",
        value: totalUsers.toLocaleString(),
        icon: <Mail size={28} />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        title: "Cadastrados",
        value: totalUsers.toLocaleString(),
        icon: <Calendar size={28} />,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
    ];
  }, [users]);

  // Paginação
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const searchLower = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.id?.toString().includes(searchLower)
    );
  }, [users, search]);

  const pageCount = useMemo(() => {
    if (itemsPerPage === -1) return 1;
    return Math.ceil(filteredUsers.length / itemsPerPage);
  }, [filteredUsers, itemsPerPage]);

  const paginatedUsers = useMemo(() => {
    if (itemsPerPage === -1) return filteredUsers;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page, itemsPerPage]);

  const paginationText = useMemo(() => {
    if (filteredUsers.length === 0) return "0 usuários";
    if (itemsPerPage === -1) return `${filteredUsers.length} usuários`;
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, filteredUsers.length);
    return `${start}-${end} de ${filteredUsers.length} usuários`;
  }, [filteredUsers, page, itemsPerPage]);

  // Fetch data
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsersAction({ search });
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      let result;
      if (data.id) {
        const updateData = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password || "",
        };
        result = await updateUserAction(updateData);
      } else {
        result = await createUserAction(data);
      }
      
      if (result.success) {
        resetForm();
        setIsModalOpen(false);
        fetchUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeletingId(selectedUser.id);
    try {
      const result = await deleteUserAction(selectedUser.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
      setSelectedUser(null);
    }
  };

  const resetForm = () => {
    reset({
      id: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    reset({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleExport = () => {
    const csvData = users.map(u => ({
      ID: u.id,
      Nome: u.name,
      Email: u.email,
      'Data Cadastro': formatDate(u.createdAt),
    }));
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
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
              <ChevronRightIcon size={10} /> Usuários
            </div>
            <h1 className={styles.title}>Usuários</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton} disabled>
              <Download size={16} /> Exportar
            </button>
            <button className={styles.primaryButton} disabled>
              <Plus size={16} /> Novo Usuário
            </button>
          </div>
        </div>
        <div className={styles.metricsGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonMetric} />
          ))}
        </div>
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonCell} style={{ width: "200px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "250px" }}></div>
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
            <ChevronRightIcon size={10} /> Usuários
          </div>
          <h1 className={styles.title}>Usuários</h1>
          <p className={styles.subtitle}>
            Gerencie os administradores do sistema
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={handleExport}>
            <Download size={16} /> Exportar
          </button>
          <button className={styles.primaryButton} onClick={openCreateModal}>
            <Plus size={16} /> Novo Usuário
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricsCard}>
            <div className={styles.metricsIconWrapper} style={{ backgroundColor: metric.bgColor, color: metric.color }}>
              {metric.icon}
            </div>
            <div className={styles.metricsTextWrapper}>
              <p className={styles.metricsValue}>{metric.value}</p>
              <p className={styles.metricsTitle}>{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className={styles.emptyContainer}>
          <Users size={80} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Nenhum usuário encontrado</p>
          <p className={styles.emptySubtitle}>
            {search ? "Tente uma busca diferente" : "Clique em 'Novo Usuário' para adicionar"}
          </p>
        </div>
      )}

      {/* Users Table */}
      {!loading && filteredUsers.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Usuário</th>
                  <th className={styles.tableHeaderCell}>E-mail</th>
                  <th className={styles.tableHeaderCell}>Data Cadastro</th>
                  <th className={styles.tableHeaderCell} style={{ width: "100px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userId}>#{user.id.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.emailCell}>
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.dateCell}>
                        <Calendar size={12} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => openEditModal(user)}
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className={styles.deleteButton}
                          disabled={user.id === session?.user?.id}
                          onClick={() => openDeleteModal(user)}
                          title={user.id === session?.user?.id ? "Não é possível excluir o próprio usuário" : "Excluir"}
                        >
                          <Trash2 size={14} />
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {formId ? "Editar Usuário" : "Novo Usuário"}
              </h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSubmitForm)} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formFieldFull}>
                  <label className={styles.formLabel}>Nome Completo</label>
                  <input
                    type="text"
                    className={`${styles.formInput} ${errors.name ? styles.error : ""}`}
                    {...register("name", { required: "Nome é obrigatório" })}
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
                </div>

                <div className={styles.formFieldFull}>
                  <label className={styles.formLabel}>E-mail</label>
                  <input
                    type="email"
                    className={`${styles.formInput} ${errors.email ? styles.error : ""}`}
                    {...register("email", { 
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido"
                      }
                    })}
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                </div>

                {!formId && (
                  <>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Senha</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`${styles.formInput} ${errors.password ? styles.error : ""}`}
                          {...register("password", { 
                            required: "Senha é obrigatória",
                            minLength: {
                              value: 6,
                              message: "Senha deve ter no mínimo 6 caracteres"
                            }
                          })}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Confirmar Senha</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ""}`}
                          {...register("confirmPassword", {
                            required: "Confirme a senha",
                            validate: (value) => value === passwordValue || "As senhas não coincidem"
                          })}
                        />
                      </div>
                      {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalIcon}>
              <Trash2 size={48} />
            </div>
            <h2 className={styles.deleteModalTitle}>Confirmar exclusão</h2>
            <p className={styles.deleteModalText}>
              Tem certeza que deseja excluir o usuário <strong>{selectedUser.name}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </p>
            <div className={styles.deleteModalActions}>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className={styles.deleteConfirmButton} onClick={handleDelete}>
                {deletingId === selectedUser.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
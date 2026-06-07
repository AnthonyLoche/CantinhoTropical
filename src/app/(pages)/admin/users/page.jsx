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
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  Eye,
  EyeOff,
  LayoutDashboard,
  ChevronRight as ChevronRightIcon,
  Download,
  Filter,
  ArrowUpDown,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import styles from "@/assets/css/admin/users.module.css";
import { useSession } from "next-auth/react";

// Mock data - substituir pela API real
const mockUsers = [
  {
    id: "1",
    name: "Administrador Master",
    email: "admin@cantinhotropical.com",
    role: "SUPER_ADMIN",
    status: "active",
    lastLogin: new Date("2024-06-04T10:30:00"),
    createdAt: new Date("2024-01-15T00:00:00"),
    avatar: null,
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@cantinhotropical.com",
    role: "ADMIN",
    status: "active",
    lastLogin: new Date("2024-06-03T15:45:00"),
    createdAt: new Date("2024-02-10T00:00:00"),
    avatar: null,
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria@cantinhotropical.com",
    role: "MANAGER",
    status: "active",
    lastLogin: new Date("2024-06-04T09:15:00"),
    createdAt: new Date("2024-03-20T00:00:00"),
    avatar: null,
  },
  {
    id: "4",
    name: "Pedro Costa",
    email: "pedro@cantinhotropical.com",
    role: "VIEWER",
    status: "inactive",
    lastLogin: new Date("2024-05-28T14:20:00"),
    createdAt: new Date("2024-04-05T00:00:00"),
    avatar: null,
  },
];

const roleConfig = {
  SUPER_ADMIN: { label: "Super Admin", color: "#dc2626", bgColor: "rgba(220, 38, 38, 0.1)", icon: ShieldAlert },
  ADMIN: { label: "Administrador", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)", icon: ShieldCheck },
  MANAGER: { label: "Gerente", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)", icon: Shield },
  VIEWER: { label: "Visualizador", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)", icon: Eye },
};

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
      role: "VIEWER",
      status: "active",
    },
  });

  const formId = watch("id");
  const passwordValue = watch("password");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;

    return [
      {
        title: "Total de Usuários",
        value: totalUsers.toLocaleString(),
        icon: <Users size={28} />,
        color: "#2c694e",
        bgColor: "rgba(44, 105, 78, 0.1)",
      },
      {
        title: "Usuários Ativos",
        value: activeUsers.toLocaleString(),
        icon: <CheckCircle size={28} />,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        title: "Super Admins",
        value: superAdmins.toLocaleString(),
        icon: <ShieldAlert size={28} />,
        color: "#dc2626",
        bgColor: "rgba(220, 38, 38, 0.1)",
      },
      {
        title: "Administradores",
        value: admins.toLocaleString(),
        icon: <ShieldCheck size={28} />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
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
      // Simular API call - substituir pela ação real
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (data.id) {
        // Update user logic
        console.log("Updating user:", data);
      } else {
        // Create user logic
        console.log("Creating user:", data);
      }
      resetForm();
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeletingId(selectedUser.id);
    try {
      // Delete user logic
      console.log("Deleting user:", selectedUser.id);
      setIsDeleteModalOpen(false);
      fetchUsers();
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
      role: "VIEWER",
      status: "active",
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
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    console.log(`Toggling user ${user.id} status to ${newStatus}`);
    // API call here
    fetchUsers();
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

  const getRoleDisplay = (role) => {
    const config = roleConfig[role] || roleConfig.VIEWER;
    const Icon = config.icon;
    return (
      <span className={styles.roleChip} style={{ backgroundColor: config.bgColor, color: config.color }}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const handleExport = () => {
    const csvData = users.map(u => ({
      ID: u.id,
      Nome: u.name,
      Email: u.email,
      Função: roleConfig[u.role]?.label || u.role,
      Status: u.status === 'active' ? 'Ativo' : 'Inativo',
      'Último Acesso': formatDate(u.lastLogin),
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
              <div className={styles.skeletonCell} style={{ width: "120px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "100px" }}></div>
              <div className={styles.skeletonCell} style={{ width: "160px" }}></div>
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
            Gerencie os administradores e permissões do sistema
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
        <button className={styles.filterButton}>
          <Filter size={15} /> Filtros
        </button>
        <button className={styles.filterButton}>
          <ArrowUpDown size={15} /> Ordenar
        </button>
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
                  <th className={styles.tableHeaderCell}>Função</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Último Acesso</th>
                  <th className={styles.tableHeaderCell} style={{ width: "100px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <span>{user.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userId}>#{user.id}</div>
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
                      {getRoleDisplay(user.role)}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusChip} ${user.status === 'active' ? styles.activeStatus : styles.inactiveStatus}`}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.lastLoginCell}>
                        <Calendar size={12} />
                        {formatDate(user.lastLogin)}
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
                          className={user.status === 'active' ? styles.suspendButton : styles.activateButton}
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                        >
                          {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
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

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Função</label>
                  <select className={styles.formSelect} {...register("role")}>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="MANAGER">Gerente</option>
                    <option value="VIEWER">Visualizador</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Status</label>
                  <select className={styles.formSelect} {...register("status")}>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
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
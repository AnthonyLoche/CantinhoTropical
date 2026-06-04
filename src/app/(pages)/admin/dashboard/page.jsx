"use client";

import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  ShoppingBag,
  TrendingUp,
  PawPrint,
} from "lucide-react";
import styles from "../../../../assets/css/admin/dashboard.module.css";
import { useSession } from "next-auth/react";

export default function DashboardClient() {
  // Dados mockados (substituir por API real)
  const { data: session } = useSession();

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      icon: Calendar,
      color: "#2c694e",
      bg: "rgba(44, 105, 78, 0.1)",
    },
    {
      title: "Total de Clientes",
      value: "248",
      icon: Users,
      color: "#01261f",
      bg: "rgba(1, 38, 31, 0.1)",
    },
    {
      title: "Serviços Ativos",
      value: "18",
      icon: Scissors,
      color: "#83a69c",
      bg: "rgba(131, 166, 156, 0.1)",
    },
    {
      title: "Produtos em Destaque",
      value: "24",
      icon: ShoppingBag,
      color: "#2c694e",
      bg: "rgba(44, 105, 78, 0.1)",
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      client: "Ana Silva",
      service: "Banho e Tosa",
      time: "09:00",
      status: "Confirmado",
    },
    {
      id: 2,
      client: "Carlos Santos",
      service: "Consulta Veterinária",
      time: "10:30",
      status: "Em andamento",
    },
    {
      id: 3,
      client: "Mariana Costa",
      service: "Hidratação",
      time: "14:00",
      status: "Agendado",
    },
  ];

  const topProducts = [
    { id: 1, name: "Ração Premium", sales: 45, trend: "+12%" },
    { id: 2, name: "Brinquedo Natural", sales: 32, trend: "+8%" },
    { id: 3, name: "Cama Confort", sales: 28, trend: "+5%" },
  ];

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
        {stats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className={styles.twoColumnGrid}>
        {/* Recent Appointments */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <Calendar size={18} />
              Próximos Agendamentos
            </h3>
            <a href="/admin/appointments" className={styles.cardLink}>
              Ver todos →
            </a>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>{app.client}</td>
                    <td>{app.service}</td>
                    <td>{app.time}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[app.status.toLowerCase().replace(" ", "")]}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <PawPrint size={18} />
              Produtos Mais Vendidos
            </h3>
            <a href="/admin/products" className={styles.cardLink}>
              Ver todos →
            </a>
          </div>
          <div className={styles.productList}>
            {topProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productSales}>{product.sales} vendas</p>
                </div>
                <span className={styles.productTrend}>{product.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Ações Rápidas</h3>
        <div className={styles.actionGrid}>
          <button
            className={styles.actionCard}
            onClick={() =>
              (window.location.href = "/admin/register-appointment")
            }
          >
            <Calendar size={24} />
            <span>Novo Agendamento</span>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => (window.location.href = "/admin/clients/new")}
          >
            <Users size={24} />
            <span>Novo Cliente</span>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => (window.location.href = "/admin/services/new")}
          >
            <Scissors size={24} />
            <span>Novo Serviço</span>
          </button>
          <button
            className={styles.actionCard}
            onClick={() => (window.location.href = "/admin/products/new")}
          >
            <ShoppingBag size={24} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Users,
  Settings,
  User,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
  Grid3x3,
} from "lucide-react";
import styles from "../../../assets/css/admin/admin.module.css";
import logo_removed from "../../../assets/images/logo_removedbg.png";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userEmail = session.user?.email || "admin@cantinhotropical.com";
  const userRole = session.user?.role || "Administrador";

  // Menu items - atualizados
  const primaryMenuItems = [
    { title: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
    { title: "Produtos", icon: Package, route: "/admin/products" },
    { title: "Categorias", icon: FolderTree, route: "/admin/categories" },
    { title: "Marcas", icon: Tag, route: "/admin/brands" },
    { title: "Usuários", icon: Users, route: "/admin/usuarios" },
    { title: "Configurações", icon: Settings, route: "/admin/configuracoes" },
  ];


  // Mobile bottom nav
  const bottomNavItems = [
    { title: "Início", icon: LayoutDashboard, route: "/admin/dashboard" },
    { title: "Produtos", icon: Package, route: "/admin/products" },
    { title: "Categorias", icon: FolderTree, route: "/admin/categories" },
    { title: "Mais", icon: Grid3x3, route: null, isAction: true },
  ];

  // More items (para o botão "Mais" no mobile)
  const moreItems = [
    { title: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
    { title: "Produtos", icon: Package, route: "/admin/products" },
    { title: "Categorias", icon: FolderTree, route: "/admin/categories" },
    { title: "Marcas", icon: Tag, route: "/admin/brands" },
    { title: "Usuários", icon: Users, route: "/admin/usuarios" },
    { title: "Configurações", icon: Settings, route: "/admin/configuracoes" },
  ];

  const isActive = (route) => {
    if (route === "/admin") return pathname === "/admin";
    return pathname === route || pathname.startsWith(route + "/");
  };

  const navigate = (route) => {
    setShowActionSheet(false);
    setShowMoreSheet(false);
    setShowProfileSheet(false);
    router.push(route);
  };

  const handleLogout = async () => {
    setShowProfileSheet(false);
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <div className={styles.adminContainer}>
      {/* Desktop Sidebar */}
      {!isMobile && sidebarOpen && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoSection}>
              <Image
                src={logo_removed}
                alt="Cantinho Tropical"
                width={40}
                height={40}
                className={styles.logoImg}
              />
              <div className={styles.logoInfo}>
                <h1 className={styles.logoTitle}>CANTINHO TROPICAL</h1>
              </div>
            </div>
            <button
              className={styles.toggleBtn}
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.navSection}>
            <span className={styles.navLabel}>Menu Principal</span>
            <div className={styles.navList}>
              {primaryMenuItems.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`${styles.navItem} ${isActive(item.route) ? styles.active : ""}`}
                >
                  <item.icon size={20} />
                  <span className={styles.navItemTitle}>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.divider} />


          <div className={styles.sidebarFooter}>
            <div className={styles.divider} />
            <div className={styles.userRow}>
              <div className={styles.userAvatar}>
                <User size={16} />
              </div>
              <div className={styles.userInfo}>
                <p className={styles.userEmail}>{userEmail}</p>
                <p className={styles.userRole}>{userRole}</p>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile: Collapsed sidebar toggle */}
      {!isMobile && !sidebarOpen && (
        <button
          className={styles.sidebarToggle}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Main Content */}
      <main
        className={`${styles.mainContent} ${!sidebarOpen && !isMobile ? styles.mainExpanded : ""}`}
      >
        {!isMobile && <div className={styles.pageContainer}>{children}</div>}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Mobile Top Bar */}
            <div className={styles.mobileTopbar}>
              <div className={styles.mobileTopbarInner}>
                <div className={styles.mobileBrand}>
                  <Image
                    src={logo_removed}
                    alt="Cantinho Tropical"
                    width={34}
                    height={34}
                    className={styles.mobileLogo}
                  />
                  <span className={styles.mobileTitle}>CANTINHO TROPICAL</span>
                </div>
                <div className={styles.mobileTopbarActions}>
                </div>
              </div>
            </div>

            {/* Mobile Page Content */}
            <div className={styles.mobilePageContainer}>{children}</div>

            {/* Mobile Bottom Nav */}
            <div className={styles.bottomNav}>
              {bottomNavItems.map((item) => {
                if (item.isAction) {
                  return (
                    <button
                      key="more"
                      className={styles.bottomNavItem}
                      onClick={() => setShowMoreSheet(true)}
                    >
                      <div className={styles.bottomNavIcon}>
                        <Grid3x3 size={22} />
                      </div>
                      <span className={styles.bottomNavLabel}>Mais</span>
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`${styles.bottomNavItem} ${isActive(item.route) ? styles.active : ""}`}
                  >
                    <div className={styles.bottomNavIcon}>
                      <item.icon size={22} />
                    </div>
                    <span className={styles.bottomNavLabel}>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Action Sheet: Novo */}
      {showActionSheet && (
        <div
          className={styles.sheetOverlay}
          onClick={() => setShowActionSheet(false)}
        >
          <div
            className={styles.actionSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHandle} />
            <h3 className={styles.sheetTitle}>Criar novo</h3>
            <div className={styles.sheetActions}>
              {quickActions.map((item) => (
                <button
                  key={item.route}
                  className={styles.sheetItem}
                  onClick={() => navigate(item.route)}
                >
                  <div className={styles.sheetItemIcon}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className={styles.sheetItemTitle}>{item.title}</p>
                    <p className={styles.sheetItemDesc}>{item.desc}</p>
                  </div>
                  <ChevronRight size={18} className={styles.sheetChevron} />
                </button>
              ))}
            </div>
            <button
              className={styles.sheetCancel}
              onClick={() => setShowActionSheet(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Action Sheet: Mais (Mobile) */}
      {showMoreSheet && (
        <div
          className={styles.sheetOverlay}
          onClick={() => setShowMoreSheet(false)}
        >
          <div
            className={styles.actionSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHandle} />
            <h3 className={styles.sheetTitle}>Menu</h3>
            <div className={styles.sheetActions}>
              {moreItems.map((item) => (
                <button
                  key={item.route}
                  className={styles.sheetItem}
                  onClick={() => navigate(item.route)}
                >
                  <div className={styles.sheetItemIcon}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className={styles.sheetItemTitle}>{item.title}</p>
                  </div>
                  <ChevronRight size={18} className={styles.sheetChevron} />
                </button>
              ))}
            </div>
            <button
              className={styles.sheetCancel}
              onClick={() => setShowMoreSheet(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Action Sheet: Perfil */}
      {showProfileSheet && (
        <div
          className={styles.sheetOverlay}
          onClick={() => setShowProfileSheet(false)}
        >
          <div
            className={styles.actionSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHandle} />

            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                <User size={28} />
              </div>
              <div>
                <p className={styles.profileEmail}>{userEmail}</p>
                <p className={styles.profileRole}>{userRole}</p>
              </div>
            </div>

            <div className={styles.sheetActions}>
              <button
                className={styles.sheetItem}
                onClick={() => navigate("/admin/perfil")}
              >
                <div className={styles.sheetItemIcon}>
                  <User size={20} />
                </div>
                <div>
                  <p className={styles.sheetItemTitle}>Meu Perfil</p>
                </div>
                <ChevronRight size={18} className={styles.sheetChevron} />
              </button>
              <button
                className={styles.sheetItem}
                onClick={() => navigate("/admin/configuracoes")}
              >
                <div className={styles.sheetItemIcon}>
                  <Settings size={20} />
                </div>
                <div>
                  <p className={styles.sheetItemTitle}>Configurações</p>
                </div>
                <ChevronRight size={18} className={styles.sheetChevron} />
              </button>
            </div>

            <button
              className={`${styles.sheetCancel} ${styles.logoutBtnSheet}`}
              onClick={handleLogout}
            >
              <LogOut size={16} style={{ marginRight: 6 }} />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
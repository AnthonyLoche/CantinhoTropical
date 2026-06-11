"use client";

import { useState, useEffect } from "react";
import { LogIn, LayoutDashboard, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/app/components/cart/CartDrawer";
import SearchBar from "@/app/components/ui/SearchBar";
import styles from "../../../assets/css/ui/Header.module.css";
import logo_removed from "../../../assets/images/logo_removedbg.png";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha drawer ao mudar de rota
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Bloqueia scroll do body quando drawer aberto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navLinks = [
    { href: "/",         label: "Home"      },
    { href: "/catalog",  label: "Catálogo"  },
    { href: "/contact",  label: "Contacto"  },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.mainBar}>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image src={logo_removed} alt="Cantinho Tropical Logo" width={54} height={54} />
            <span className={styles.logoText}>Cantinho Tropical</span>
          </Link>

          {/* Nav — desktop */}
          <nav className={styles.nav}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={isActive(href) ? styles.navLinkActive : styles.navLink}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions — desktop */}
          <div className={styles.actions}>
            <SearchBar />
            <button className={styles.cartBtn} onClick={openDrawer}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>
            {isAuthenticated ? (
              <Link href="/admin/dashboard" className={styles.adminBtn}>
                <LayoutDashboard size={18} />
                <span>Admin</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>

        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayVisible : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}>
        {/* Drawer header */}
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.logo}>
            <Image src={logo_removed} alt="Cantinho Tropical Logo" width={40} height={40} />
            <span className={styles.logoText} style={{ fontSize: "18px" }}>Cantinho Tropical</span>
          </Link>
          <button
            className={styles.closeBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search no drawer */}
        <div className={styles.drawerSearch}>
          <SearchBar />
        </div>

        {/* Nav links */}
        <nav className={styles.drawerNav}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.drawerLink} ${isActive(href) ? styles.drawerLinkActive : ""}`}
            >
              {label}
              <ChevronRight size={16} className={styles.drawerChevron} />
            </Link>
          ))}
        </nav>

        <div className={styles.drawerDivider} />

        {/* Carrinho e auth no drawer */}
        <div className={styles.drawerActions}>
          <button className={styles.drawerActionBtn} onClick={() => { openDrawer(); setDrawerOpen(false); }}>
            <div className={styles.drawerActionIcon}>
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </div>
            <span>Carrinho</span>
            <ChevronRight size={16} className={styles.drawerChevron} />
          </button>

          {isAuthenticated ? (
            <Link href="/admin/dashboard" className={styles.drawerActionBtn}>
              <div className={styles.drawerActionIcon}>
                <LayoutDashboard size={20} />
              </div>
              <span>Admin</span>
              <ChevronRight size={16} className={styles.drawerChevron} />
            </Link>
          ) : (
            <Link href="/login" className={styles.drawerActionBtn}>
              <div className={styles.drawerActionIcon}>
                <LogIn size={20} />
              </div>
              <span>Entrar</span>
              <ChevronRight size={16} className={styles.drawerChevron} />
            </Link>
          )}
        </div>
      </aside>

      <CartDrawer />
    </>
  );
}
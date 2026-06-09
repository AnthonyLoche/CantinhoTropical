"use client";

import { useState, useEffect } from "react";
import { Search, LogIn, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "../../../assets/css/ui/Header.module.css";
import logo_removed from "../../../assets/images/logo_removedbg.png";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catálogo" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.mainBar}>
        <Link href="/" className={styles.logo}>
          <Image
            src={logo_removed}
            alt="Cantinho Tropical Logo"
            width={74}
            height={74}
          />
          <span className={styles.logoText}>Cantinho Tropical</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? styles.navLinkActive : styles.navLink}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <Search size={16} />
            </button>
          </div>

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
      </div>
    </header>
  );
}
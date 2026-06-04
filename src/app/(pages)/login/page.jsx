"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { 
  Trees, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  LogIn,
  Shield 
} from "lucide-react";
import styles from "../../../assets/css/login/page.module.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    window.location.href = "/admin/dashboard";
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles.main}>
      {/* Left Side: Botanical Sanctuary Visual */}
      <section className={styles.leftSection}>
        <div className={styles.bgImage}></div>
        <div className={styles.overlay}></div>
        <div className={styles.leftContent}>
          {/* Top Header (Inside Visual) */}
          <div className={styles.topHeader}>
            <Trees size={36} className={styles.forestIcon} />
            <h1 className={styles.logoText}>Cantinho Tropical</h1>
          </div>
          {/* Bottom Quote */}
          <div className={styles.quoteWrapper}>
            <div className={styles.quoteLine}></div>
            <p className={styles.quoteText}>
              Onde a biodiversidade encontra o cuidado especializado para quem você mais ama.
            </p>
            <p className={styles.quoteSubtext}>
              Manual de Boas Práticas &amp; Curadoria Pet
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Administrative Login */}
      <section className={styles.rightSection}>
        {/* Navigation Shell (Contextual TopBar) */}
        <nav className={styles.topNav}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} className={styles.backIcon} />
            <span>Retornar ao site</span>
          </Link>
          <Lock size={20} className={styles.lockIcon} />
        </nav>

        <div className={styles.loginContainer}>
          <header className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Acesso Restrito</h2>
            <p className={styles.loginSubtitle}>Portal do Administrador</p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail Corporativo
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={20} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  placeholder="nome@cantinhotropical.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha de Acesso
              </label>
              <div className={styles.inputWrapper}>
                <Key size={20} className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className={styles.eyeButton}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Esqueceu a senha?
              </Link>
            </div>

            {error && (
              <p className={styles.errorMessage}>
                {error}
              </p>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Entrando..." : "Entrar no Painel"}
              <LogIn size={20} />
            </button>
          </form>
        </div>

        {/* Footer Shell */}
        <footer className={styles.footer}>
          <span className={styles.copyright}>
            © 2024 Cantinho Tropical Petshop. Acesso Restrito.
          </span>
          <div className={styles.footerLinks}>
            <Link href="/security-policy" className={styles.footerLink}>
              Security Policy
            </Link>
            <Link href="/support" className={styles.footerLink}>
              Technical Support
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
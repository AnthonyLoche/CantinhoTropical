"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Package,
  ShoppingBag,
  Database,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  LayoutDashboard,
  ChevronRight,
  Building2,
  Clock,
  MapPin,
  Phone,
  Mail as MailIcon,
  Lock,
  Key,
  LogOut,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "@/assets/css/admin/settings.module.css";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form states
  const [general, setGeneral] = useState({
    storeName: "Cantinho Tropical",
    storeEmail: "contato@cantinhotropical.com",
    storePhone: "+351 915 290 212",
    storeAddress: "Rua das Laranjeiras, 2640-577 Mafra, Portugal",
    timezone: "Europe/Lisbon",
    currency: "EUR",
    language: "pt-PT",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    newOrdersAlerts: true,
    marketingEmails: false,
    smsAlerts: false,
    pushNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    primaryColor: "#01261f",
    compactMode: false,
    showRecentItems: true,
    itemsPerPage: 10,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    ipWhitelist: "",
  });

  const tabs = [
    { id: "general", label: "Geral", icon: Building2 },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "security", label: "Segurança", icon: Shield },
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <LayoutDashboard size={12} /> Admin
            <ChevronRight size={10} /> Configurações
          </div>
          <h1 className={styles.title}>Configurações</h1>
          <p className={styles.subtitle}>
            Gerencie as configurações do sistema e preferências da sua conta
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw size={16} className={styles.spinning} />
            ) : (
              <Save size={16} />
            )}
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>

      {saved && (
        <div className={styles.toast}>
          Configurações salvas com sucesso!
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* General Settings */}
        {activeTab === "general" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Building2 size={20} />
              Informações da Loja
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nome da Loja</label>
                <input
                  type="text"
                  value={general.storeName}
                  onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>E-mail</label>
                <input
                  type="email"
                  value={general.storeEmail}
                  onChange={(e) => setGeneral({ ...general, storeEmail: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Telefone</label>
                <input
                  type="tel"
                  value={general.storePhone}
                  onChange={(e) => setGeneral({ ...general, storePhone: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formFieldFull}>
                <label className={styles.formLabel}>Endereço</label>
                <input
                  type="text"
                  value={general.storeAddress}
                  onChange={(e) => setGeneral({ ...general, storeAddress: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Fuso Horário</label>
                <select
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Moeda</label>
                <select
                  value={general.currency}
                  onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar ($)</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Idioma</label>
                <select
                  value={general.language}
                  onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="pt-PT">Português (PT)</option>
                  <option value="pt-BR">Português (BR)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === "notifications" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Bell size={20} />
              Preferências de Notificações
            </h2>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <MailIcon size={18} />
                  <div>
                    <h4>Alertas por E-mail</h4>
                    <p>Receba notificações importantes por e-mail</p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <Package size={18} />
                  <div>
                    <h4>Estoque Baixo</h4>
                    <p>Alertar quando produtos estiverem com estoque baixo</p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <ShoppingBag size={18} />
                  <div>
                    <h4>Novos Pedidos</h4>
                    <p>Notificar quando novos pedidos forem realizados</p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.newOrdersAlerts}
                    onChange={(e) => setNotifications({ ...notifications, newOrdersAlerts: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <Smartphone size={18} />
                  <div>
                    <h4>SMS Alerts</h4>
                    <p>Receba alertas por SMS (custos adicionais)</p>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Palette size={20} />
              Aparência
            </h2>
            <div className={styles.themeSelector}>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={appearance.theme === "light"}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                />
                <div className={styles.themeCard}>
                  <Sun size={24} />
                  <span>Claro</span>
                </div>
              </label>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={appearance.theme === "dark"}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                />
                <div className={styles.themeCard}>
                  <Moon size={24} />
                  <span>Escuro</span>
                </div>
              </label>
              <label className={styles.themeOption}>
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={appearance.theme === "system"}
                  onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                />
                <div className={styles.themeCard}>
                  <Monitor size={24} />
                  <span>Sistema</span>
                </div>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Cor Primária</label>
              <div className={styles.colorPicker}>
                <input
                  type="color"
                  value={appearance.primaryColor}
                  onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                  className={styles.colorInput}
                />
                <span>{appearance.primaryColor}</span>
              </div>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div>
                  <h4>Modo Compacto</h4>
                  <p>Reduzir espaçamentos para mostrar mais informações</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={appearance.compactMode}
                  onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Itens por página</label>
              <select
                value={appearance.itemsPerPage}
                onChange={(e) => setAppearance({ ...appearance, itemsPerPage: parseInt(e.target.value) })}
                className={styles.formSelect}
              >
                <option value={10}>10 itens</option>
                <option value={25}>25 itens</option>
                <option value={50}>50 itens</option>
                <option value={100}>100 itens</option>
              </select>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Shield size={20} />
              Segurança
            </h2>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <Key size={18} />
                <div>
                  <h4>Autenticação de Dois Fatores (2FA)</h4>
                  <p>Adicione uma camada extra de segurança à sua conta</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={security.twoFactorAuth}
                  onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <Clock size={18} />
                <div>
                  <h4>Tempo de Sessão (minutos)</h4>
                  <p>Tempo máximo de inatividade antes de desconectar</p>
                </div>
              </div>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                className={styles.smallSelect}
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={120}>2 horas</option>
                <option value={480}>8 horas</option>
              </select>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <Lock size={18} />
                <div>
                  <h4>Notificações de Login</h4>
                  <p>Receba alertas quando novas sessões iniciarem</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={security.loginNotifications}
                  onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>IPs Permitidos (opcional)</label>
              <textarea
                placeholder="Digite os IPs permitidos, um por linha"
                value={security.ipWhitelist}
                onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
                className={styles.formTextarea}
                rows={3}
              />
              <p className={styles.fieldHint}>Deixe em branco para permitir qualquer IP</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
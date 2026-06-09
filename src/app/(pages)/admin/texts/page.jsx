"use client";

import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  LayoutDashboard,
  ChevronRight,
  Eye,
  FileText,
  Hash,
  AlignLeft,
  Globe,
  Home,
  ShoppingBag,
  Building2,
  Hotel,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import styles from "@/assets/css/admin/texts.module.css";
import { getTextContentAdminAction } from "@/modules/text-content/actions/get-text-content-admin.action";
import { updateTextContentAction } from "@/modules/text-content/actions/update-text-content.action";

export default function AdminTextContentPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const {
    register,
    handleSubmit,
    reset,
    watch,  // ← Adicione o watch aqui
    formState: { errors },
  } = useForm({
    defaultValues: {
      heroBadge: "",
      heroTitle: "",
      heroDescription: "",
      categoriesTitle: "",
      categoriesDescription: "",
      aboutTitle: "",
      aboutDescription: "",
      petHotelChip: "",
      petHotelTitle: "",
      petHotelDescription: "",
      contactTitle: "",
      contactDescription: "",
    },
  });

  // Adicione também o watchValues para pré-visualização
  const watchValues = watch();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await getTextContentAdminAction();
      if (result.success && result.data) {
        reset({
          heroBadge: result.data.heroBadge || "",
          heroTitle: result.data.heroTitle || "",
          heroDescription: result.data.heroDescription || "",
          categoriesTitle: result.data.categoriesTitle || "",
          categoriesDescription: result.data.categoriesDescription || "",
          aboutTitle: result.data.aboutTitle || "",
          aboutDescription: result.data.aboutDescription || "",
          petHotelChip: result.data.petHotelChip || "",
          petHotelTitle: result.data.petHotelTitle || "",
          petHotelDescription: result.data.petHotelDescription || "",
          contactTitle: result.data.contactTitle || "",
          contactDescription: result.data.contactDescription || "",
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const result = await updateTextContentAction(data);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "hero", title: "Hero", icon: Home, description: "Seção principal da página inicial" },
    { id: "categories", title: "Categorias", icon: ShoppingBag, description: "Títulos da seção de categorias" },
    { id: "about", title: "Sobre Nós", icon: Building2, description: "Conteúdo da seção sobre a empresa" },
    { id: "petHotel", title: "Pet Hotel", icon: Hotel, description: "Informações do serviço de hotel" },
    { id: "contact", title: "Contacto", icon: Mail, description: "Textos da seção de contato" },
  ];

  const getSectionFields = () => {
    switch (activeSection) {
      case "hero":
        return [
          { name: "heroBadge", label: "Badge", icon: Hash, type: "text", placeholder: "Há mais de 20 anos cuidando dos seus animais", rows: 1 },
          { name: "heroTitle", label: "Título Principal", icon: FileText, type: "textarea", placeholder: "Tudo para o seu pet, aquário e animais exóticos.", rows: 2 },
          { name: "heroDescription", label: "Descrição", icon: AlignLeft, type: "textarea", placeholder: "Alimentação, acessórios, medicamentos...", rows: 3 },
        ];
      case "categories":
        return [
          { name: "categoriesTitle", label: "Título", icon: FileText, type: "text", placeholder: "Explore a nossa Biodiversidade", rows: 1 },
          { name: "categoriesDescription", label: "Descrição", icon: AlignLeft, type: "textarea", placeholder: "Tratamos de todas as especialidades...", rows: 3 },
        ];
      case "about":
        return [
          { name: "aboutTitle", label: "Título", icon: FileText, type: "text", placeholder: "Tradição e Especialização em Mafra", rows: 1 },
          { name: "aboutDescription", label: "Descrição", icon: AlignLeft, type: "textarea", placeholder: "No Cantinho Tropical, acreditamos...", rows: 6 },
        ];
      case "petHotel":
        return [
          { name: "petHotelChip", label: "Chip/Badge", icon: Hash, type: "text", placeholder: "Férias Tranquilas", rows: 1 },
          { name: "petHotelTitle", label: "Título", icon: FileText, type: "text", placeholder: "Vai viajar? Nós cuidamos do seu companheiro.", rows: 1 },
          { name: "petHotelDescription", label: "Descrição", icon: AlignLeft, type: "textarea", placeholder: "O nosso Pet Hotel oferece um ambiente de luxo...", rows: 4 },
        ];
      case "contact":
        return [
          { name: "contactTitle", label: "Título", icon: FileText, type: "text", placeholder: "Visite o nosso refúgio", rows: 1 },
          { name: "contactDescription", label: "Descrição", icon: AlignLeft, type: "textarea", placeholder: "Estamos localizados em Mafra...", rows: 3 },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Carregando conteúdo...</p>
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
            <ChevronRight size={10} /> Conteúdo da Home
          </div>
          <h1 className={styles.title}>Conteúdo da Página Inicial</h1>
          <p className={styles.subtitle}>
            Gerencie todos os textos da página principal do site
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.previewButton} onClick={() => window.open("/", "_blank")}>
            <Eye size={16} /> Visualizar Site
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving ? (
              <RefreshCw size={16} className={styles.spinning} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>

      {saved && (
        <div className={styles.toast}>
          Conteúdo salvo com sucesso!
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* Sidebar com seções */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            <Globe size={18} />
            <span>Seções</span>
          </div>
          <div className={styles.sidebarNav}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.sidebarItem} ${activeSection === section.id ? styles.sidebarItemActive : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={18} />
                <div className={styles.sidebarItemContent}>
                  <span>{section.title}</span>
                  <small>{section.description}</small>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Formulário principal */}
        <form className={styles.form}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            <p className={styles.formDescription}>
              {sections.find(s => s.id === activeSection)?.description}
            </p>
          </div>

          <div className={styles.formFields}>
            {getSectionFields().map((field) => (
              <div key={field.name} className={styles.formField}>
                <label className={styles.formLabel}>
                  <field.icon size={14} className={styles.fieldIcon} />
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={field.rows}
                    className={`${styles.formTextarea} ${errors[field.name] ? styles.error : ""}`}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    className={`${styles.formInput} ${errors[field.name] ? styles.error : ""}`}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                  />
                )}
                {errors[field.name] && (
                  <span className={styles.errorMessage}>{errors[field.name]?.message}</span>
                )}
                <p className={styles.fieldHint}>
                  Este texto aparece na seção {sections.find(s => s.id === activeSection)?.title.toLowerCase()} da página inicial
                </p>
              </div>
            ))}
          </div>

          <div className={styles.formPreview}>
            <h3 className={styles.previewTitle}>Pré-visualização</h3>
            <div className={styles.previewCard}>
              {getSectionFields().map((field) => {
                const value = watchValues[field.name];
                if (!value) return null;
                return (
                  <div key={field.name} className={styles.previewItem}>
                    <span className={styles.previewLabel}>{field.label}:</span>
                    <p className={styles.previewText}>{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.saveFooterButton}
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
        >
          {saving ? "Salvando todas as alterações..." : "Salvar todas as alterações"}
        </button>
      </div>
    </div>
  );
}
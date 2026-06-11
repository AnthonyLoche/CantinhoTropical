"use client";

import { X, Lightbulb, BookOpen, ListChecks, Layers, Plus, Trash2 } from "lucide-react";
import NextImage from "next/image";
import { useFieldArray } from "react-hook-form";
import styles from "@/assets/css/admin/products.module.css";

export default function ProductModal({
  isOpen,
  onClose,
  formId,
  register,
  errors,
  control,
  watchedImage,
  brands,
  categories,
  isSubmitting,
  uploading,
  handleSubmit,
  onSubmit,
  onFileChange,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () => {
    append({ label: "", quantity: 0, price: "" });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {formId ? "Editar Produto" : "Novo Produto"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalForm}>
          <div className={styles.formGrid}>
            {/* Nome */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Nome</label>
              <input
                type="text"
                className={`${styles.formInput} ${errors.name ? styles.error : ""}`}
                {...register("name", { required: "Nome é obrigatório" })}
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
            </div>

            {/* Descrição */}
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea
                rows={3}
                className={`${styles.formTextarea} ${errors.description ? styles.error : ""}`}
                {...register("description")}
              />
            </div>

            {/* Preço */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Preço (€)</label>
              <input
                type="number"
                step="0.01"
                className={`${styles.formInput} ${errors.price ? styles.error : ""}`}
                {...register("price", {
                  required: "Preço é obrigatório",
                  min: { value: 0, message: "Preço deve ser maior que 0" },
                })}
              />
              {errors.price && <span className={styles.errorMessage}>{errors.price.message}</span>}
            </div>

            {/* Estoque */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Estoque</label>
              <input
                type="number"
                className={`${styles.formInput} ${errors.stock ? styles.error : ""}`}
                {...register("stock", {
                  required: "Estoque é obrigatório",
                  min: { value: 0, message: "Estoque deve ser maior ou igual a 0" },
                })}
              />
              {errors.stock && <span className={styles.errorMessage}>{errors.stock.message}</span>}
            </div>

            {/* Imagem */}
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>Imagem</label>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && onFileChange) {
                    onFileChange(file);
                  }
                }}
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

            {/* Marca */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Marca</label>
              <select className={styles.formSelect} {...register("brandId")}>
                <option value="">Selecione uma marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Categoria</label>
              <select className={styles.formSelect} {...register("categoryId")}>
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dica do Especialista */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <Lightbulb size={14} className={styles.inlineIcon} /> Dica do Especialista
              </label>
              <textarea
                rows={2}
                className={styles.formTextarea}
                {...register("hint")}
                placeholder="Ex: Misture gradualmente com a ração anterior..."
              />
            </div>

            {/* Modo de Uso */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>
                <BookOpen size={14} className={styles.inlineIcon} /> Modo de Uso
              </label>
              <textarea
                rows={2}
                className={styles.formTextarea}
                {...register("howUse")}
                placeholder="Ex: Servir 200g por dia para cães de porte médio..."
              />
            </div>

            {/* Ingredientes */}
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>
                <ListChecks size={14} className={styles.inlineIcon} /> Ingredientes
              </label>
              <textarea
                rows={3}
                className={styles.formTextarea}
                {...register("ingredients")}
                placeholder="Ex: Frango desidratado, arroz, milho, vitaminas..."
              />
            </div>

            {/* Variantes */}
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>
                <Layers size={14} className={styles.inlineIcon} /> Variantes (tamanhos, pesos, cores)
              </label>
              <div className={styles.variantsSection}>
                {fields.map((field, index) => (
                  <div key={field.id} className={styles.variantRow}>
                    <input
                      type="text"
                      placeholder="Label (ex: 1kg, P, Azul)"
                      className={styles.variantInput}
                      {...register(`variants.${index}.label`)}
                    />
                    <input
                      type="number"
                      placeholder="Estoque"
                      className={styles.variantInput}
                      {...register(`variants.${index}.quantity`, { valueAsNumber: true })}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Preço"
                      className={styles.variantInput}
                      {...register(`variants.${index}.price`, { valueAsNumber: true })}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={styles.removeVariantBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addVariant} className={styles.addVariantBtn}>
                  <Plus size={16} /> Adicionar variante
                </button>
              </div>
            </div>

            {/* Status */}
            <div className={styles.formFieldCheckbox}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register("active")} />
                <span>Ativo</span>
              </label>
            </div>

            <div className={styles.formFieldCheckbox}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register("featured")} />
                <span>Em Destaque</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton} disabled={isSubmitting || uploading}>
              {isSubmitting || uploading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
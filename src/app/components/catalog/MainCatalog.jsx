"use client";

import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import styles from "../../../assets/css/catalog/MainCatalog.module.css";

const products = [
  {
    id: 1,
    name: "Ração Premium para Aves Exóticas",
    category: "Aves Exóticas",
    price: "189,90",
    badge: "Novo",
    badgeClass: "badgeNew",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI_QxTGPKB0l7E3pZ9KfqgXC-XUt_MY3FHYqvrHqK7H1u5Cw-1ZPtB1UUYFtKGM9tEpHUI1-xATukLC1FV_UFyce-vX5y0rSRnU001x_2xfIg4WBR8xQke0kz3OacePkOxHnb6i3x6AiukR7DExBH4Q1pf945UgFAakfVs6MaORwBUfSAmallVkfQm7BNfujgxLTqCWj-XyutiN2eDwoLdEOL9_OcuSeqekarzn12RgBnr4ufymMF8KTZX4z5fyMP1_mtrWQB0K68",
  },
  {
    id: 2,
    name: "Brinquedo de Corda Natural Bio",
    category: "Cães",
    price: "74,00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-SL-LSVJ_9QK2n-zf3_CaqcOs6pJOXxZt3tXWux_nLEtjUgTk5fVyudUu5rv4FwDwyZYAaGJqQy0kSERA5vPJ9Lv2striYOt7Yo-bZxchWQh-THsLA8NlGuKZq8R-ISK0Ny19pxiMOY6kYvwyzCWqxYsn9mnUCOBfUiij2xcGFhmUIhN6ySKRRWIuL7llo9Ae5wbPuXiQVb1nETrpHToayfteLUKfjj5VSMineDdvZn_s-XCSQhXqPr5GV1u8ln7AWNN_5q_3iGM",
  },
  {
    id: 3,
    name: "Filtro Profissional Silent Flow",
    category: "Aquarismo",
    price: "520,00",
    badge: "Especialista",
    badgeClass: "badgeSpecialist",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP49A8NQvwIMbFbUScAAn-EDb8NUvj-RiR-xdWjUL4gN60uPBv6XDV2coZj3D6XlXrO7POeBjPhFJvrCQO2MQFm0kH3I3iXp-GRQSkMZadOVV_kpF5Zv_xqrrYNWRoSL1ZLkmEN8Obe9_jinYjjJtckOEeGRXCcvmGUWjP7xNbWy4esOuva9BmBo2C-XLzQHs1SS8Agud0-EXRSXc8y2qLNaAawjUCHB8l_HsXahGRf1bHFwanLOht1-wyomjwCFO8Y1hnuR4lk5U",
  },
  {
    id: 4,
    name: "Coleira em Pele Genuína Artesanal",
    category: "Cães e Gatos",
    price: "215,90",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0_iVgDMejlGAu6lhOKmcEashsD98Qx_3RJHPUJHxOVnFPzF7miWyx5ZBgPPIp3SOkYJcusngXJavsvlGM97X8QNCkOjzaQd-3gHapFRA6OuUdsRYxrnT89yNyVlUA0E0mFop_tcdkXgZLYNEn76nHYHm9RJ1riyLktdkxJoGv1qPqFhJ4Uu7DqmykUCpNQnRrs2ejCTQtbceYGaazYX9HprD-wQBBnKVnqStPW27uWND1sYB2Ia-wr1wh4z-JuiDmOIKCAVrx1Q4",
  },
  {
    id: 5,
    name: "Ração Holística Super Premium",
    category: "Cães",
    price: "345,00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBwclSHKJkEVLqT2UZXHRCLOSlclYkZWxTRJqOEnLq4OgzFJzNap-z1wrgpTFvpGiyQKIuTQnJ4_OSr1I2ieuk6tNcOFTMRgzlW919W4ZSm4ng43XOBIkcrtD1bxJzx4nMltmU7aCJuOxTBU6r971x_anx-7wmtPXs4kOPI-hwSIrzGEfQTuse33n46EjzKGpjfYiMnzGIbWc1FI46GCtnWQP2htpEV8tiL1B73PQdCV8d1nI3D7UPOOmBblQyw4R2PBTUis0EENM",
  },
  {
    id: 6,
    name: "Luminária Cerâmica Pro-Heat",
    category: "Exóticos",
    price: "289,00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnbAkmaSTY-f9L_QExVYK6koazRZzMWi2zHuhENkuC7gqoAQrRMOzx68WwXfxDAyhGF8ICsFvZRx9NXYwk9eAxF3MgpqDat1_xM5J8ixB6ordk4o0YlLfOih3lVnNeKaYshtpylYO8TFcywoqj0tHD1Nn-4GGMstJil1zEUM2sEYRsvhs1Ar9d1bv7WiO5Ejqx9DLfL_5sF5uJ32vFE2NAp3g1pfCJ6-2yeUOPLwIEATpHCxJBk_uI7Jgf9C7JbFmCUlNFTcINeQ0",
  },
];

export default function MainCatalog() {
  const [priceRange, setPriceRange] = useState(500);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Sidebar Filter */}
        <aside className={styles.sidebar}>
          <div className={styles.sticky}>
            <div className={styles.filterHeader}>
              <Filter size={20} className={styles.filterIcon} />
              <h2 className={styles.filterTitle}>Filtros</h2>
            </div>
            <p className={styles.filterSubtitle}>Refine sua busca</p>

            {/* Categories */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterGroupTitle}>Categorias</h4>
              <div className={styles.checkboxGroup}>
                {["Cães", "Gatos", "Aves Exóticas", "Aquarismo", "Exóticos"].map((cat) => (
                  <label key={cat} className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterGroupTitle}>Faixa de Preço</h4>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className={styles.rangeInput}
                />
                <div className={styles.priceLabels}>
                  <span>R$ 0</span>
                  <span>R$ {priceRange}+</span>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterGroupTitle}>Marcas Premium</h4>
              <div className={styles.checkboxGroup}>
                {["BioNature", "Tropical Care", "Exotic Master"].map((brand) => (
                  <label key={brand} className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className={styles.clearBtn}>Limpar Filtros</button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className={styles.productSection}>
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>
              Mostrando <span className={styles.resultCountBold}>12 de 48</span> produtos selecionados
            </p>
            <div className={styles.sortBox}>
              <span>Ordenar por:</span>
              <select className={styles.sortSelect}>
                <option>Mais recentes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais populares</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.productImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.badge && (
                    <span className={`${styles.badge} ${styles[product.badgeClass]}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>R$ {product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button className={styles.pageBtn}>
              <ChevronLeft size={20} />
            </button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span className={styles.dots}>...</span>
            <button className={styles.pageBtn}>12</button>
            <button className={styles.pageBtn}>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
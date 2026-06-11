// app/cart/page.jsx
"use client";

import { useState } from "react";
import styles from "@/assets/css/cart/cart.module.css";
import Image from "next/image";
import { HeaderMain, FooterMain } from "@/app/components";
import { 
  ChevronRight, 
  Trash2, 
  Minus, 
  Plus, 
  Info, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Stethoscope,
  Lightbulb 
} from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Ração Holística Super Premium - Aves Exóticas",
      category: "Aves Exóticas",
      price: 34.5,
      quantity: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDMy318cWHdYGGg6ZSQaqTM9yjUqzASdgbTMn7IxXdryNeZENCJqeSVyj8GVCNcvAST8xFDMxcpw1JVhSKdIPAE4_FhIpODiDhfm4_6zzu_7gLwM5Ch_h3eYpk1GfiI6-XyjtvjKwzi2sYru70hEcOPJdMNpVvcPaEJ2ZMGlsv7bNjGQdTzcIqMHS_anRlIiNiwizzqMhuW8atVktvTnlkLfaM3JHIY6VFSbGG0f4nTUb9lFzfvooKASlBSYFoJ0dzCJMkusueOnxc",
    },
    {
      id: 2,
      name: "Corda de Juta Sustentável",
      category: "Brinquedos",
      price: 45.0,
      quantity: 2,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDUGv9fMKaXH0KsO4SMwtQ5jxc_rs2M75dkIYnd_k0ZIyTJu0Y3hrCNnkl9189uZfhnXCJehD7R2ZH0F4cvN0OnnPw1Qh-99g0GyBdkmyeWtblVn0pDSkwM-S7NcDCUxjd9zz4mfKUtL_yI8QAdWzB1YP36kt9pbCxE1F8ApyTQRSKJyK8oQmLYscKJ6T_o0qdFCicx5xk1uEL_o98QGh4MkqhfJHk7_0cotzdav_V7Z9Syzu-N_LdygzFbWGhEizgKfgl7IdAMbx4",
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      <HeaderMain />

      <main className={styles.main}>
        <nav className={styles.breadcrumbs}>
          <a href="#" className={styles.breadcrumbLink}>
            Home
          </a>
          <ChevronRight size={16} className={styles.breadcrumbIcon} />
          <a href="#" className={styles.breadcrumbLink}>
            Loja
          </a>
          <ChevronRight size={16} className={styles.breadcrumbIcon} />
          <span className={styles.breadcrumbActive}>Carrinho</span>
        </nav>

        <h1 className={styles.title}>O Seu Carrinho</h1>

        <div className={styles.grid}>
          {/* Product List Area */}
          <div className={styles.productList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.productItem}>
                <div className={styles.productImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className={styles.image}
                  />
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productHeader}>
                    <div>
                      <span className={styles.productCategory}>
                        {item.category}
                      </span>
                      <h3 className={styles.productName}>{item.name}</h3>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className={styles.productFooter}>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className={styles.price}>
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {cartItems.length === 0 && (
              <div className={styles.emptyState}>
                <Leaf size={48} className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>À procura de mais?</p>
                <p className={styles.emptyText}>
                  Explore a nossa seleção botânica curada para os seus
                  companheiros.
                </p>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Resumo da Encomenda</h2>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>

                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
              </div>

              <div className={styles.checkoutActions}>
                <button className={styles.checkoutBtn}>
                  Finalizar Compra
                  <ArrowRight size={20} />
                </button>
                <a href="#" className={styles.continueBtn}>
                  Continuar a Comprar
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>
      <FooterMain />
    </>
  );
}
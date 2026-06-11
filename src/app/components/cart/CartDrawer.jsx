// src/app/components/cart/CartDrawer.jsx
"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import styles from "@/assets/css/cart/CartDrawer.module.css";

export default function CartDrawer() {
  const {
    cartItems,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotalItems,
    getSubtotal,
  } = useCart();

  // Prevenir scroll quando drawer estiver aberto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleWhatsApp = () => {
    const message = cartItems
      .map((item) => `• ${item.name} x${item.quantity}`)
      .join("\n");

    const totalItems = getTotalItems();
    const subtotal = getSubtotal();

    const fullMessage = `Olá! Gostaria de solicitar os seguintes produtos:

${message}

Total de itens: ${totalItems}

Valor estimado: ${formatPrice(subtotal)}

Nome: 
Telefone: 

Obrigado!`;

    const encodedMessage = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/5547992236761?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeDrawer} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <ShoppingBag size={24} />
            Meu Carrinho
          </h2>
          <button className={styles.closeBtn} onClick={closeDrawer}>
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag size={64} />
            <p>Seu carrinho está vazio</p>
            <Link href="/catalog" className={styles.shopBtn} onClick={closeDrawer}>
              Ver Produtos
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.imageWrapper}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>📷</div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.itemPrice}>
                      {formatPrice(item.price)}
                    </div>

                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Total de itens:</span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="/cart" className={styles.viewCartBtn} onClick={closeDrawer}>
                  Ver Carrinho
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
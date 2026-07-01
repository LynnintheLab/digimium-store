import { DeleteOutlined, MinusOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { Drawer, Empty, message } from "antd";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useProductData } from "@/context/product-data-context";
import { formatMoney, getProductPlans } from "@/data/products";
import { buildTelegramOrder, telegramUrl } from "@/lib/telegram";

export function CartDrawer() {
  const { items, total, isOpen, setIsOpen, changeQuantity, removeItem } = useCart();
  const { findProduct } = useProductData();

  const checkout = () => {
    const url = telegramUrl(buildTelegramOrder(items, findProduct));
    if (!url) {
      message.error("Add the Digimium Telegram username in src/lib/telegram.ts before launch.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Drawer
      className="cart-drawer"
      title={<div><span>Your order</span><strong>Cart</strong></div>}
      placement="right"
      size={440}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      footer={items.length > 0 ? (
        <div className="cart-drawer-footer">
          <div><span>Total</span><strong>{formatMoney(total)}</strong></div>
          <Button size="lg" className="w-full" onClick={checkout}>
            Continue to Telegram <SendOutlined aria-hidden="true" />
          </Button>
          <small>No payment is collected on this website.</small>
        </div>
      ) : null}
    >
      {items.length === 0 ? (
        <div className="cart-empty-state">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your cart is empty" />
          <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
            <Link to="/store">Browse the store</Link>
          </Button>
        </div>
      ) : (
        <div className="cart-lines">
          {items.map((item) => {
            const product = findProduct(item.productId);
            const plans = product ? getProductPlans(product) : [];
            const plan = plans.find((candidate) => candidate.id === item.planId) ?? plans[0];
            const duration = plan?.durations.find((option) => option.label === item.duration);
            if (!product || !plan || !duration) return null;
            return (
              <article className="cart-line" key={`${item.productId}-${plan.id}-${item.duration}`}>
                <div className={`cart-line-mark cart-line-mark--${product.tone}`} aria-hidden="true">
                  {product.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="cart-line-copy">
                  <Link to={`/product/${product.id}`} onClick={() => setIsOpen(false)}>{product.name}</Link>
                  <span>{plan.name} · {item.duration} · {formatMoney(duration.price)}</span>
                  <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                    <button type="button" onClick={() => changeQuantity(product.id, item.duration, -1, plan.id)} aria-label={`Decrease ${product.name}`}><MinusOutlined /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(product.id, item.duration, 1, plan.id)} aria-label={`Increase ${product.name}`}><PlusOutlined /></button>
                  </div>
                </div>
                <div className="cart-line-side">
                  <strong>{formatMoney(duration.price * item.quantity)}</strong>
                  <button type="button" onClick={() => removeItem(product.id, item.duration, plan.id)} aria-label={`Remove ${product.name}`}><DeleteOutlined /></button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}

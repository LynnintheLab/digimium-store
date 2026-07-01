import { House, LayoutGrid, Mail, ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuOneProps {
  cartCount: number;
  onCartOpen: () => void;
}

const navLinks = [
  { label: "Home", key: "/", icon: <House size={14} /> },
  { label: "Store", key: "/store", icon: <LayoutGrid size={14} /> },
  { label: "Contact us", key: "/contact", icon: <Mail size={14} /> },
];

export default function MenuOne({ cartCount, onCartOpen }: MenuOneProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey =
    location.pathname.startsWith("/store") || location.pathname.startsWith("/product")
      ? "/store"
      : location.pathname.startsWith("/contact")
        ? "/contact"
        : "/";

  return (
    <header className="site-header">
      <div className="header-shell">
        <button className="brand-lockup" type="button" onClick={() => navigate("/")} aria-label="Digimium home">
          <span className="logo-plate" aria-hidden="true">
            <img src="/digimium-logo-blue.png" alt="" />
          </span>
        </button>

        <div className="header-navigation">
          <nav className="digimium-nav" aria-label="Main navigation">
            {navLinks.map(({ label, key, icon }) => (
              <button
                key={key}
                type="button"
                className={`digimium-nav-item${selectedKey === key ? " is-active" : ""}`}
                onClick={() => navigate(key)}
                aria-current={selectedKey === key ? "page" : undefined}
              >
                {icon && <span className="digimium-nav-icon" aria-hidden="true">{icon}</span>}
                <span className="digimium-nav-label">{label}</span>
              </button>
            ))}
          </nav>
          <div className="cart-badge-wrap">
            <button
              className="cart-menu-button"
              type="button"
              onClick={onCartOpen}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingCart size={16} aria-hidden="true" />
              <span>Cart</span>
            </button>
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">{cartCount}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

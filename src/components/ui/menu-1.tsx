import { AppstoreOutlined, HomeOutlined, MailOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Menu } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuOneProps {
  cartCount: number;
  onCartOpen: () => void;
}

const items: Required<MenuProps>["items"] = [
  { label: "Home", key: "/", icon: <HomeOutlined /> },
  { label: "Store", key: "/store", icon: <AppstoreOutlined /> },
  { label: "Contact us", key: "/contact", icon: <MailOutlined /> },
];

export default function MenuOne({ cartCount, onCartOpen }: MenuOneProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname.startsWith("/store") || location.pathname.startsWith("/product")
    ? "/store"
    : location.pathname.startsWith("/contact")
      ? "/contact"
      : "/";

  const onClick: MenuProps["onClick"] = ({ key }) => navigate(key);

  return (
    <header className="site-header">
      <div className="header-shell">
        <button className="brand-lockup" type="button" onClick={() => navigate("/")} aria-label="Digimium home">
          <span className="logo-plate" aria-hidden="true">
            <img src="/digimium-logo-blue.png" alt="" />
          </span>
        </button>

        <div className="header-navigation">
          <Menu
            className="digimium-menu"
            onClick={onClick}
            selectedKeys={[selectedKey]}
            mode="horizontal"
            items={items}
          />
          <Badge count={cartCount} size="small" offset={[-3, 3]} showZero={false}>
            <button className="cart-menu-button" type="button" onClick={onCartOpen} aria-label={`Open cart, ${cartCount} items`}>
              <ShoppingCartOutlined />
              <span>Cart</span>
            </button>
          </Badge>
        </div>
      </div>
    </header>
  );
}

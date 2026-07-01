import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { CartDrawer } from "@/components/cart/cart-drawer";
import MenuOne from "@/components/ui/menu-1";
import { useCart } from "@/context/cart-context";

export function SiteLayout() {
  const { count, setIsOpen } = useCart();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="site-root">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <MenuOne cartCount={count} onCartOpen={() => setIsOpen(true)} />
      <main id="main-content"><Outlet /></main>
      {!isHome && (
        <footer className="site-footer">
          <div>
            <span>digimium</span>
            <p>Digital subscriptions, simply sorted.</p>
          </div>
          <nav aria-label="Footer navigation">
            <LinkItem href="/">Home</LinkItem>
            <LinkItem href="/store">Store</LinkItem>
            <LinkItem href="/contact">Contact us</LinkItem>
          </nav>
        </footer>
      )}
      <CartDrawer />
    </div>
  );
}

function LinkItem({ href, children }: { href: string; children: string }) {
  return <Link to={href}>{children}</Link>;
}

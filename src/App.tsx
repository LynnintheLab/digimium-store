import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SiteLayout } from "@/components/layout/site-layout";
import { CartProvider } from "@/context/cart-context";
import { ProductDataProvider } from "@/context/product-data-context";

const HomePage = lazy(() => import("@/pages/home-page").then((module) => ({ default: module.HomePage })));
const StorePage = lazy(() => import("@/pages/store-page").then((module) => ({ default: module.StorePage })));
const ProductPage = lazy(() => import("@/pages/product-page").then((module) => ({ default: module.ProductPage })));
const ContactPage = lazy(() => import("@/pages/contact-page").then((module) => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import("@/pages/admin-page").then((module) => ({ default: module.AdminPage })));

export default function App() {
  return (
    <BrowserRouter>
      <ProductDataProvider>
        <CartProvider>
          <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>
            <Routes>
              <Route path="admin" element={<AdminPage />} />
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="store" element={<StorePage />} />
                <Route path="product/:productId" element={<ProductPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </ProductDataProvider>
    </BrowserRouter>
  );
}

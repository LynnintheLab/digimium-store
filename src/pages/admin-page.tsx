import { Database, ImagePlus, LockKeyhole, Plus, Save, ShieldAlert, Trash2 } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { message } from "antd";

import { Button } from "@/components/ui/button";
import { contacts as seedContacts } from "@/data/contacts";
import { products as seedProducts } from "@/data/products";
import type { ContactLink, DurationOption, Product, ProductPlan, ProductStatus } from "@/types";

const statuses: ProductStatus[] = ["available", "out-of-stock", "dm-for-price", "hidden"];

type ApiContact = ContactLink & {
  image_url?: string;
  background_url?: string;
  sort_order?: number;
};

async function adminRequest<T>(path: string, pin: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      "x-admin-pin": pin,
      ...init.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Admin request failed.");
  return data as T;
}

function normalizeContact(contact: ApiContact): ContactLink {
  return {
    ...contact,
    imageUrl: String(contact.imageUrl || contact.image_url || ""),
    backgroundUrl: String(contact.backgroundUrl || contact.background_url || ""),
    sortOrder: Number(contact.sortOrder ?? contact.sort_order ?? 0),
  };
}

function materializePlans(product: Product): Product {
  const plans = product.plans?.length
    ? product.plans
    : [{
        id: `${product.id}-standard`,
        name: "Standard",
        description: "",
        status: product.status ?? "available",
        durations: product.durations ?? [],
      }];

  return { ...product, plans, durations: plans[0]?.durations ?? [] };
}

export function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<ContactLink[]>([]);
  const [apiMode, setApiMode] = useState<"api" | "preview">("preview");
  const [notice, setNotice] = useState("");
  const [activeProductId, setActiveProductId] = useState("");
  const [savingId, setSavingId] = useState("");

  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? products[0],
    [activeProductId, products],
  );

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!pin.trim()) return;

    try {
      const [productData, contactData] = await Promise.all([
        adminRequest<{ products: Product[] }>("/api/admin/products", pin),
        adminRequest<{ contacts: ContactLink[] }>("/api/admin/contacts", pin),
      ]);
      setProducts(productData.products.map(materializePlans));
      setContacts(contactData.contacts.map(normalizeContact));
      setActiveProductId(productData.products[0]?.id ?? "");
      setApiMode("api");
      setNotice("Connected to MySQL API. Changes can be saved.");
      setIsAuthed(true);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "API is not ready.";
      if (reason.toLowerCase().includes("pin")) {
        message.error(reason);
        return;
      }
      setProducts(seedProducts.map(materializePlans));
      setContacts(seedContacts);
      setActiveProductId(seedProducts[0]?.id ?? "");
      setApiMode("preview");
      setNotice("Preview mode: API/MySQL is not connected yet, so changes are not saved.");
      setIsAuthed(true);
    }
  };

  const updateProduct = (productId: string, patch: Partial<Product>) => {
    setProducts((current) => current.map((product) => product.id === productId ? { ...product, ...patch } : product));
  };

  const createDraftProduct = () => {
    const id = `new-product-${Date.now()}`;
    const draft: Product = {
      id,
      name: "New product",
      category: "AI Tools",
      summary: "Short product description for the store card.",
      description: "Longer product detail for customers.",
      status: "available",
      statusNote: "",
      tone: "blue",
      logoBackground: "#f6f6f6",
      promoted: false,
      promotionLabel: "Limited offer",
      promotionNote: "",
      durations: [
        { label: "1 month", price: 0 },
        { label: "3 months", price: 0 },
      ],
      plans: [{
        id: `${id}-standard`,
        name: "Standard",
        description: "",
        status: "available",
        durations: [
          { label: "1 month", price: 0 },
          { label: "3 months", price: 0 },
        ],
      }],
      features: [
        { title: "What you get", items: ["Product benefit"] },
        { title: "Digimium service", items: ["Telegram order support", "Clear price before confirmation"] },
      ],
    };
    setProducts((current) => [draft, ...current]);
    setActiveProductId(id);
  };

  const setProductPlans = (productId: string, plans: ProductPlan[]) => {
    setProducts((current) => current.map((product) => {
      if (product.id !== productId) return product;
      return { ...product, plans, durations: plans[0]?.durations ?? [] };
    }));
  };

  const addPlan = (product: Product) => {
    const plans = product.plans ?? [];
    const nextPlan: ProductPlan = {
      id: `plan-${Date.now()}`,
      name: `Plan ${plans.length + 1}`,
      description: "",
      status: "available",
      durations: [{ label: "1 month", price: 0, status: "available" }],
    };
    setProductPlans(product.id, [...plans, nextPlan]);
  };

  const updatePlan = (product: Product, planId: string, patch: Partial<ProductPlan>) => {
    setProductPlans(product.id, (product.plans ?? []).map((plan) => (
      plan.id === planId ? { ...plan, ...patch } : plan
    )));
  };

  const deletePlan = (product: Product, planId: string) => {
    const plans = product.plans ?? [];
    if (plans.length <= 1) {
      message.warning("A product needs at least one plan card.");
      return;
    }
    setProductPlans(product.id, plans.filter((plan) => plan.id !== planId));
  };

  const addDuration = (product: Product, planId: string) => {
    const plan = product.plans?.find((candidate) => candidate.id === planId);
    if (!plan) return;
    const nextDuration: DurationOption = {
      label: `${plan.durations.length + 1} months`,
      price: 0,
      status: "available",
    };
    updatePlan(product, planId, { durations: [...plan.durations, nextDuration] });
  };

  const updateDuration = (
    product: Product,
    planId: string,
    durationIndex: number,
    patch: Partial<DurationOption>,
  ) => {
    const plan = product.plans?.find((candidate) => candidate.id === planId);
    if (!plan) return;
    updatePlan(product, planId, {
      durations: plan.durations.map((duration, index) => index === durationIndex ? { ...duration, ...patch } : duration),
    });
  };

  const deleteDuration = (product: Product, planId: string, durationIndex: number) => {
    const plan = product.plans?.find((candidate) => candidate.id === planId);
    if (!plan) return;
    if (plan.durations.length <= 1) {
      message.warning("A plan needs at least one duration.");
      return;
    }
    updatePlan(product, planId, { durations: plan.durations.filter((_, index) => index !== durationIndex) });
  };

  const saveProduct = async (product: Product) => {
    if (apiMode !== "api") {
      message.warning("Start the Node API and connect MySQL before saving.");
      return;
    }
    setSavingId(product.id);
    try {
      const payload = {
        ...product,
        plans: product.plans ?? [{ id: "default", name: "Standard", durations: product.durations }],
      };
      const data = await adminRequest<{ product: Product }>(`/api/admin/products/${product.id}`, pin, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      updateProduct(product.id, materializePlans(data.product));
      message.success("Product saved.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSavingId("");
    }
  };

  const deleteProduct = async (product: Product) => {
    if (apiMode === "api") {
      try {
        await adminRequest(`/api/admin/products/${product.id}`, pin, { method: "DELETE" });
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Could not delete product.");
        return;
      }
    }
    setProducts((current) => current.filter((candidate) => candidate.id !== product.id));
    setActiveProductId(products.find((candidate) => candidate.id !== product.id)?.id ?? "");
    message.success(apiMode === "api" ? "Product deleted." : "Product removed from preview.");
  };

  const uploadLogo = async (product: Product, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (apiMode !== "api") {
      message.warning("Start the Node API and connect MySQL before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const data = await adminRequest<{ url: string }>("/api/admin/uploads", pin, {
        method: "POST",
        body: formData,
      });
      updateProduct(product.id, { logoUrl: data.url });
      message.success("Logo uploaded. Save product to keep it.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not upload logo.");
    }
  };

  const uploadContactImage = async (contact: ContactLink, event: ChangeEvent<HTMLInputElement>, field: "imageUrl" | "backgroundUrl") => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (apiMode !== "api") {
      message.warning("Start the Node API and connect MySQL before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const data = await adminRequest<{ url: string }>("/api/admin/uploads", pin, {
        method: "POST",
        body: formData,
      });
      updateContact(contact.id, { [field]: data.url });
      message.success("Photo uploaded. Save contact to keep it.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not upload photo.");
    }
  };

  const updateContact = (contactId: string, patch: Partial<ContactLink>) => {
    setContacts((current) => current.map((contact) => contact.id === contactId ? { ...contact, ...patch } : contact));
  };

  const createDraftContact = () => {
    const id = `new-contact-${Date.now()}`;
    const draft: ContactLink = {
      id,
      type: "telegram",
      title: "New contact",
      subtitle: "Contact label",
      url: "https://t.me/",
      status: "available",
    };
    setContacts((current) => [draft, ...current]);
  };

  const saveContact = async (contact: ContactLink) => {
    if (apiMode !== "api") {
      message.warning("Start the Node API and connect MySQL before saving.");
      return;
    }
    setSavingId(contact.id);
    try {
      const data = await adminRequest<{ contact: ContactLink }>(`/api/admin/contacts/${contact.id}`, pin, {
        method: "PUT",
        body: JSON.stringify(contact),
      });
      updateContact(contact.id, normalizeContact(data.contact));
      message.success("Contact saved.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not save contact.");
    } finally {
      setSavingId("");
    }
  };

  const deleteContact = async (contact: ContactLink) => {
    if (apiMode === "api") {
      try {
        await adminRequest(`/api/admin/contacts/${contact.id}`, pin, { method: "DELETE" });
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Could not delete contact.");
        return;
      }
    }
    setContacts((current) => current.filter((candidate) => candidate.id !== contact.id));
    message.success(apiMode === "api" ? "Contact deleted." : "Contact removed from preview.");
  };

  if (!isAuthed) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <div className="admin-login-mark"><LockKeyhole aria-hidden="true" /></div>
          <p>Digimium admin</p>
          <h1>Manage products without touching code.</h1>
          <label>
            Admin PIN
            <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="Enter admin PIN" type="password" />
          </label>
          <Button size="lg" type="submit">Open admin</Button>
          <small>Set ADMIN_PIN in your .env file (minimum 12 characters).</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <p>digimium admin</p>
          <h1>Product control room</h1>
        </div>
        <span className={apiMode === "api" ? "admin-pill admin-pill--live" : "admin-pill"}>
          <Database aria-hidden="true" />
          {apiMode === "api" ? "MySQL connected" : "Preview mode"}
        </span>
      </header>

      {notice && (
        <div className="admin-notice">
          <ShieldAlert aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}

      <section className="admin-workspace">
        <aside className="admin-product-list" aria-label="Products">
          <div>
            <h2>Products</h2>
            <button className="admin-add-button" onClick={createDraftProduct} type="button">+ New</button>
          </div>
          {products.map((product) => (
            <button
              className={product.id === activeProduct?.id ? "is-active" : ""}
              key={product.id}
              onClick={() => setActiveProductId(product.id)}
              type="button"
            >
              <span>{product.name}</span>
              <small>{product.status ?? "available"}</small>
            </button>
          ))}
        </aside>

        {activeProduct && (
          <section className="admin-editor" aria-label={`${activeProduct.name} editor`}>
            <div className="admin-editor-head">
              <div>
                <span>{activeProduct.category}</span>
                <h2>{activeProduct.name}</h2>
              </div>
              <Button onClick={() => saveProduct(activeProduct)} disabled={savingId === activeProduct.id}>
                <Save aria-hidden="true" />
                {savingId === activeProduct.id ? "Saving" : "Save"}
              </Button>
              <Button onClick={() => deleteProduct(activeProduct)} variant="outline">
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </div>

            <div className="admin-form-grid">
              <label>
                Product name
                <input value={activeProduct.name} onChange={(event) => updateProduct(activeProduct.id, { name: event.target.value })} />
              </label>
              <label>
                Category
                <select value={activeProduct.category} onChange={(event) => updateProduct(activeProduct.id, { category: event.target.value as Product["category"] })}>
                  <option>AI Tools</option>
                  <option>Streaming</option>
                  <option>VPN</option>
                  <option>Creative</option>
                  <option>Productivity</option>
                  <option>Learning</option>
                </select>
              </label>
              <label>
                Status
                <select value={activeProduct.status ?? "available"} onChange={(event) => updateProduct(activeProduct.id, { status: event.target.value as ProductStatus })}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                Logo box color
                <input value={activeProduct.logoBackground ?? "#f6f6f6"} onChange={(event) => updateProduct(activeProduct.id, { logoBackground: event.target.value })} type="color" />
              </label>
              <label className="admin-field-wide">
                Showcase description
                <input value={activeProduct.summary} onChange={(event) => updateProduct(activeProduct.id, { summary: event.target.value })} />
              </label>
              <label className="admin-field-wide">
                Detail description
                <textarea value={activeProduct.description} onChange={(event) => updateProduct(activeProduct.id, { description: event.target.value })} rows={4} />
              </label>
              <label className="admin-field-wide">
                Status note
                <input value={activeProduct.statusNote ?? ""} onChange={(event) => updateProduct(activeProduct.id, { statusNote: event.target.value })} placeholder="Example: Temporarily unavailable." />
              </label>
              <label className="admin-promotion-toggle admin-field-wide">
                <input
                  checked={Boolean(activeProduct.promoted)}
                  onChange={(event) => updateProduct(activeProduct.id, { promoted: event.target.checked })}
                  type="checkbox"
                />
                <span>
                  <strong>Show in homepage promotion area</strong>
                  <small>The first promoted, available product becomes the hero offer.</small>
                </span>
              </label>
              {activeProduct.promoted && (
                <>
                  <label className="admin-field-wide">
                    Promotion label
                    <input value={activeProduct.promotionLabel ?? ""} onChange={(event) => updateProduct(activeProduct.id, { promotionLabel: event.target.value })} placeholder="Example: This week only" />
                  </label>
                  <label className="admin-field-wide">
                    Promotion note
                    <input value={activeProduct.promotionNote ?? ""} onChange={(event) => updateProduct(activeProduct.id, { promotionNote: event.target.value })} placeholder="Example: Save on a 1-year plan." />
                  </label>
                </>
              )}
            </div>

            <div className="admin-logo-panel">
              <div className="admin-logo-preview" style={{ background: activeProduct.logoBackground ?? "#f6f6f6" }}>
                {activeProduct.logoUrl ? <img src={activeProduct.logoUrl} alt="" /> : <span>{activeProduct.name.slice(0, 2).toUpperCase()}</span>}
              </div>
              <label className="admin-upload-button">
                <ImagePlus aria-hidden="true" />
                Upload product logo
                <input accept="image/*" onChange={(event) => uploadLogo(activeProduct, event)} type="file" />
              </label>
            </div>

            <section className="admin-duration-panel">
              <div className="admin-plan-section-head">
                <div>
                  <h3>Detail plan cards</h3>
                  <p>Add separate cards for Family, Individual, Private, or any other plan.</p>
                </div>
                <Button onClick={() => addPlan(activeProduct)} size="sm" variant="outline">
                  <Plus aria-hidden="true" /> Add plan card
                </Button>
              </div>
              <div className="admin-plan-list">
                {(activeProduct.plans ?? []).map((plan, planIndex) => (
                  <article className="admin-plan-card" key={plan.id}>
                    <div className="admin-plan-card-head">
                      <span>Detail card {String(planIndex + 1).padStart(2, "0")}</span>
                      <button onClick={() => deletePlan(activeProduct, plan.id)} type="button" aria-label={`Delete ${plan.name} plan`}>
                        <Trash2 aria-hidden="true" /> Delete card
                      </button>
                    </div>
                    <div className="admin-plan-fields">
                      <label>
                        Plan name
                        <input value={plan.name} onChange={(event) => updatePlan(activeProduct, plan.id, { name: event.target.value })} placeholder="Family" />
                      </label>
                      <label>
                        Plan status
                        <select value={plan.status ?? "available"} onChange={(event) => updatePlan(activeProduct, plan.id, { status: event.target.value as ProductStatus })}>
                          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </label>
                      <label className="admin-plan-description">
                        Short plan description
                        <input value={plan.description ?? ""} onChange={(event) => updatePlan(activeProduct, plan.id, { description: event.target.value })} placeholder="Best for up to 6 family members." />
                      </label>
                    </div>

                    <div className="admin-duration-table" role="group" aria-label={`${plan.name} durations`}>
                      <div className="admin-duration-table-head" aria-hidden="true">
                        <span>Duration</span><span>Price (Ks)</span><span>Before discount</span><span>Status</span><span></span>
                      </div>
                      {plan.durations.map((duration, durationIndex) => (
                        <div className="admin-duration-row" key={duration.id ?? `${plan.id}-${durationIndex}`}>
                          <label><span>Duration</span><input value={duration.label} onChange={(event) => updateDuration(activeProduct, plan.id, durationIndex, { label: event.target.value })} placeholder="1 month" /></label>
                          <label><span>Price (Ks)</span><input min={0} type="number" value={duration.price} onChange={(event) => updateDuration(activeProduct, plan.id, durationIndex, { price: Number(event.target.value) })} /></label>
                          <label><span>Before discount</span><input min={0} type="number" value={duration.originalPrice ?? ""} onChange={(event) => updateDuration(activeProduct, plan.id, durationIndex, { originalPrice: event.target.value ? Number(event.target.value) : undefined })} placeholder="Optional" /></label>
                          <label><span>Status</span><select value={duration.status ?? "available"} onChange={(event) => updateDuration(activeProduct, plan.id, durationIndex, { status: event.target.value as ProductStatus })}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
                          <button onClick={() => deleteDuration(activeProduct, plan.id, durationIndex)} type="button" aria-label={`Delete ${duration.label}`}><Trash2 aria-hidden="true" /></button>
                        </div>
                      ))}
                    </div>
                    <button className="admin-add-duration" onClick={() => addDuration(activeProduct, plan.id)} type="button">
                      <Plus aria-hidden="true" /> Add duration
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
      </section>

      <section className="admin-contact-manager">
        <div className="admin-editor-head">
          <div>
            <span>Contact us</span>
            <h2>Official links</h2>
          </div>
          <Button onClick={createDraftContact} variant="outline">+ New contact</Button>
        </div>
        <div className="admin-contact-grid">
          {contacts.map((contact) => (
            <article className="admin-contact-card" key={contact.id}>
              <label>Title<input value={contact.title} onChange={(event) => updateContact(contact.id, { title: event.target.value })} /></label>
              <label>Subtitle<input value={contact.subtitle} onChange={(event) => updateContact(contact.id, { subtitle: event.target.value })} /></label>
              <label>Link<input value={contact.url} onChange={(event) => updateContact(contact.id, { url: event.target.value })} /></label>
              <label>Profile photo URL<input value={contact.imageUrl ?? ""} onChange={(event) => updateContact(contact.id, { imageUrl: event.target.value })} /></label>
              <label>Cover photo URL<input value={contact.backgroundUrl ?? ""} onChange={(event) => updateContact(contact.id, { backgroundUrl: event.target.value })} /></label>
              <div>
                <label className="admin-upload-button admin-upload-button--small">
                  <ImagePlus aria-hidden="true" />
                  Profile
                  <input accept="image/*" onChange={(event) => uploadContactImage(contact, event, "imageUrl")} type="file" />
                </label>
                <label className="admin-upload-button admin-upload-button--small">
                  <ImagePlus aria-hidden="true" />
                  Cover
                  <input accept="image/*" onChange={(event) => uploadContactImage(contact, event, "backgroundUrl")} type="file" />
                </label>
                <Button onClick={() => saveContact(contact)} disabled={savingId === contact.id} size="sm">
                  <Save aria-hidden="true" />
                  Save
                </Button>
                <Button onClick={() => deleteContact(contact)} size="sm" variant="outline">
                  <Trash2 aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

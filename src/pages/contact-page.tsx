import { ArrowRight, Clock3, ExternalLink, MessageCircleMore, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

import { PageCanvas } from "@/components/layout/page-canvas";
import { Button } from "@/components/ui/button";
import { useProductData } from "@/context/product-data-context";
import { usePageMeta } from "@/hooks/use-page-meta";
import { telegramUrl } from "@/lib/telegram";

function PlatformIcon({ type }: { type: string }) {
  if (type.startsWith("facebook")) {
    return (
      <span className="contact-link-tag" style={{ background: "#1877F2" }} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="contact-link-tag" style={{ background: "#229ED9" }} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    </span>
  );
}

export function ContactPage() {
  usePageMeta({
    title: "Contact us",
    description: "Reach Digimium on Telegram or Facebook. Ask about products, orders, or availability — we reply fast.",
    path: "/contact",
  });

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [configError, setConfigError] = useState<string | null>(null);
  const { contacts } = useProductData();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const url = telegramUrl(`Hello Digimium, my name is ${name.trim()}.\n\n${question.trim()}`);
    if (!url) {
      setConfigError("Add the Digimium Telegram username in src/lib/telegram.ts before launch.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <PageCanvas className="contact-canvas">
      <section className="contact-layout page-shell">
        <div className="contact-copy">
          <p>CONTACT US</p>
          <h1>A real conversation, not a support maze.</h1>
          <span>Ask about a product, availability, payment, or an order. Your message opens directly in Telegram.</span>
          <ul>
            <li><MessageCircleMore aria-hidden="true" /><div><strong>Telegram first</strong><span>One familiar place for questions and orders.</span></div></li>
            <li><Clock3 aria-hidden="true" /><div><strong>Quick replies</strong><span>Designed for short, direct conversations.</span></div></li>
            <li><ShieldCheck aria-hidden="true" /><div><strong>No sensitive forms</strong><span>This website never asks for payment details.</span></div></li>
          </ul>
        </div>

        <div className="contact-stack">
          <nav className="contact-link-list" aria-label="Official Digimium links">
            {contacts.map((contact) => (
              <a className="contact-link-row" href={contact.url} key={contact.id} target="_blank" rel="noreferrer">
                <PlatformIcon type={contact.type} />
                <div className="contact-link-info">
                  <strong>{contact.title}</strong>
                  <small>{contact.subtitle}</small>
                </div>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            ))}
          </nav>

          <form className="contact-form" onSubmit={submit}>
            <div className="contact-form-header">
              <span>New message</span>
              <span>Via Telegram</span>
            </div>
            <label>
              Your name
              <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
            </label>
            <label>
              How can we help?
              <textarea required value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Tell us what you need" rows={6} />
            </label>
            <Button size="lg" type="submit">Open in Telegram <ArrowRight aria-hidden="true" /></Button>
            {configError && <p className="contact-config-error" role="alert">{configError}</p>}
            <small>Nothing is sent until you confirm inside Telegram.</small>
          </form>
        </div>
      </section>
    </PageCanvas>
  );
}

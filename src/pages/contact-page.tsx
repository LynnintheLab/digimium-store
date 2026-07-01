import { ArrowRight, Clock3, ExternalLink, MessageCircleMore, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { message } from "antd";

import { PageCanvas } from "@/components/layout/page-canvas";
import { Button } from "@/components/ui/button";
import { useProductData } from "@/context/product-data-context";
import { telegramUrl } from "@/lib/telegram";

export function ContactPage() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const { contacts } = useProductData();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const url = telegramUrl(`Hello Digimium, my name is ${name.trim()}.\n\n${question.trim()}`);
    if (!url) {
      message.error("Add the Digimium Telegram username in src/lib/telegram.ts before launch.");
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
          <div className="contact-link-grid" aria-label="Official Digimium links">
            {contacts.map((contact) => (
              <a className="contact-link-card" href={contact.url} key={contact.id} target="_blank" rel="noreferrer">
                <span><img src="/digimium-logo.png" alt="" /></span>
                <div>
                  <strong>{contact.title}</strong>
                  <small>{contact.subtitle}</small>
                </div>
                <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>

          <form className="contact-form" onSubmit={submit}>
            <div><span>NEW MESSAGE</span><span>VIA TELEGRAM</span></div>
            <label>Your name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" /></label>
            <label>How can we help?<textarea required value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Tell us what you need" rows={6} /></label>
            <Button size="lg" type="submit">Open in Telegram <ArrowRight aria-hidden="true" /></Button>
            <small>Nothing is sent until you confirm inside Telegram.</small>
          </form>
        </div>
      </section>
    </PageCanvas>
  );
}

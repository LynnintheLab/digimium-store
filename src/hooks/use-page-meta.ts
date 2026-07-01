import { useEffect } from "react";

const SITE = "Digimium";
const BASE_URL = "https://buywith-digimium.store";

interface PageMeta {
  title: string;
  description?: string;
  path?: string;
}

export function usePageMeta({ title, description, path = "" }: PageMeta) {
  useEffect(() => {
    document.title = `${title} | ${SITE}`;

    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc && description) desc.content = description;

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${title} | ${SITE}`;

    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.content = description;

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = `${BASE_URL}${path}`;

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${BASE_URL}${path}`;
  }, [title, description, path]);
}

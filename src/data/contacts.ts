import type { ContactLink } from "@/types";

export type ApiContact = ContactLink & {
  image_url?: string;
  background_url?: string;
  sort_order?: number;
};

export function normalizeContact(contact: ApiContact): ContactLink {
  return {
    ...contact,
    imageUrl: contact.imageUrl || contact.image_url || "",
    backgroundUrl: contact.backgroundUrl || contact.background_url || "",
    sortOrder: contact.sortOrder ?? contact.sort_order ?? 0,
  };
}

export const contacts: ContactLink[] = [
  {
    id: "facebook-digimium",
    type: "facebook",
    title: "digimium.",
    subtitle: "Facebook page",
    url: "https://www.facebook.com/profile.php?id=61586643983894&locale=th_TH",
    sortOrder: 1,
  },
  {
    id: "facebook-digimium-2",
    type: "facebook",
    title: "digimium. 2.0",
    subtitle: "Backup Facebook page",
    url: "https://www.facebook.com/profile.php?id=61561290184783&locale=th_TH",
    sortOrder: 2,
  },
  {
    id: "telegram-channel",
    type: "telegram-channel",
    title: "Telegram channel",
    subtitle: "@buyheredigimium",
    url: "https://t.me/buyheredigimium",
    sortOrder: 3,
  },
  {
    id: "telegram-admin",
    type: "telegram-admin",
    title: "Telegram admin",
    subtitle: "@LynnIsHeree",
    url: "https://t.me/LynnIsHeree",
    sortOrder: 4,
  },
];

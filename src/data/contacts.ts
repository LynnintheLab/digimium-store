import type { ContactLink } from "@/types";

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

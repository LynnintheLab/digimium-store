/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_USERNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

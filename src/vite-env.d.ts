/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_WIM_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

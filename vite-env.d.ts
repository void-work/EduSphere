
// Fix: Removed problematic vite/client reference that cannot be found in this environment.
// Using explicit interface definitions for environment variables instead.

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Fix: Augment NodeJS namespace to include API_KEY in ProcessEnv.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

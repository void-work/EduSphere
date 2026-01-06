/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Fix: Augment NodeJS namespace to include API_KEY in ProcessEnv.
// Removed the conflicting 'declare var process' which caused redeclaration errors 
// as 'process' is already defined by the global environment types.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

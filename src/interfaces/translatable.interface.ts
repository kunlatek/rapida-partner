import type { TLanguage } from "./language.interface";

// Texto exibido ao usuário. String simples continua válida e é tratada como
// texto no idioma padrão do projeto (IProject.defaultLanguage); o mapa por
// idioma permite declarar as traduções de cada TLanguage.
export type TTranslatable = string | Partial<Record<TLanguage, string>>;

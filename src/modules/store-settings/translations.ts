import type { TLanguage } from "../../interfaces/language.interface";

export const tr = (ptBR: string, enUS: string, esES: string): Record<TLanguage, string> => ({
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
});

/**
 * Repositórios git (GitHub, no formato `owner/repo`) que recebem o código gerado
 * deste projeto — o destino do fluxo gerar → copiar → commitar → push na branch
 * `rapida` → PR para `develop`.
 *
 * Um repositório por tipo de artefato gerado (não por ambiente): os ambientes
 * (`IFrontend`/`IBackend`) mudam URLs e credenciais, mas o código vai sempre
 * para o mesmo repositório, e o ambiente implantado é decidido pelo CI/CD dele
 * (ex.: `develop` → homolog, release → produção).
 */
export interface IProjectRepositories {
  /** Ex.: `kunlatek/administrado-36899179000108`. */
  frontend?: string;
  /** Ex.: `kunlatek/administrado-36899179000108-api`. */
  backend?: string;
  /** Repositório do agente de IA gerado (`skeleton: "aiAgent"`). */
  aiAgent?: string;
}

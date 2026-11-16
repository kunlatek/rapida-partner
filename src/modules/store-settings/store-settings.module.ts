import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm } from "../../interfaces/form.interface";
import type { IFormTab } from "../../interfaces/form-tab.interface";
import type { IModule } from "../../interfaces/project.interface";
import type { TStoreFeature } from "../../interfaces/store-settings.interface";
import { contactElements, legalElements, socialElements } from "./contact-legal.elements";
import { getFeatureElements } from "./features.elements";
import { identityElements, visualElements } from "./identity-visual.elements";
import { tr } from "./translations";

export const STORE_SETTINGS_ENDPOINT = "/store-settings";

export interface IStoreSettingsModuleOptions {
  // A mesma lista de IProjectStore.features da loja que lê esta configuração.
  features?: TStoreFeature[];
  // Quem lê a configuração sem login. "trustedCallers" (padrão): só o backend
  // da loja, com o token de serviço de IMarketplace.sellerServiceAuth.
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const buildTabs = (features: TStoreFeature[]): IFormTab => ({
  type: "tab",
  id: "storeSettingsTabs",
  tabs: [
    { id: "identity", title: tr("Identidade", "Identity", "Identidad"), elements: identityElements },
    { id: "visual", title: tr("Visual", "Look and feel", "Apariencia"), elements: visualElements },
    { id: "contact", title: tr("Contato", "Contact", "Contacto"), elements: contactElements },
    { id: "legal", title: tr("Dados legais", "Legal data", "Datos legales"), elements: legalElements },
    { id: "social", title: tr("Redes sociais", "Social media", "Redes sociales"), elements: socialElements },
    ...(features.length
      ? [{ id: "features", title: tr("Funcionalidades", "Features", "Funcionalidades"), elements: getFeatureElements(features) }]
      : []),
  ],
});

export const getStoreSettingsForm = (options: IStoreSettingsModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeSettingsForm",
  title: tr("Configuração da loja", "Store settings", "Configuración de la tienda"),
  icon: "palette",
  guards: "isAuthorized",
  isSingleRecord: true,
  elements: [buildTabs(options.features ?? [])],
  contracts: [
    {
      id: "storeSettings",
      endpoint: STORE_SETTINGS_ENDPOINT,
      actions: ["get", "update"],
      request: { entity: "storeSettings", fields: [] },
    },
  ],
  publicContracts: [
    {
      id: "storeSettings",
      endpoint: STORE_SETTINGS_ENDPOINT,
      actions: ["get"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      request: { entity: "storeSettings", fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Configuração da loja", para o Backoffice do vendedor. A loja
 * lê o registro salvo aqui por IMarketplace.storeSettingsEndpoint
 * (STORE_SETTINGS_ENDPOINT).
 */
export const getStoreSettingsModule = (options: IStoreSettingsModuleOptions = {}): IModule => ({
  id: "storeSettingsModule",
  title: tr("Configuração da loja", "Store settings", "Configuración de la tienda"),
  icon: "palette",
  components: [getStoreSettingsForm(options)],
});

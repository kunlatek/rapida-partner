import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import type { IStorageConfig } from "../../interfaces/form-file.interface";
import type { TStoreFont, TStoreRadius } from "../../interfaces/store-settings.interface";
import { tr } from "./translations";

const storageConfig: IStorageConfig = {
  path: "store-settings",
  fileNameStrategy: "uuid",
  visibility: "public",
};

const FONTS: { value: TStoreFont; label: string }[] = [
  { value: "inter", label: "Inter" },
  { value: "poppins", label: "Poppins" },
  { value: "nunito", label: "Nunito" },
  { value: "montserrat", label: "Montserrat" },
  { value: "roboto", label: "Roboto" },
  { value: "lato", label: "Lato" },
];

const RADII: { value: TStoreRadius; label: ReturnType<typeof tr> }[] = [
  { value: "none", label: tr("Reto", "Square", "Recto") },
  { value: "soft", label: tr("Suave", "Soft", "Suave") },
  { value: "rounded", label: tr("Arredondado", "Rounded", "Redondeado") },
];

export const identityElements: IFormElement[] = [
  {
    type: "input",
    name: "name",
    dataType: EDataType.TEXT,
    label: tr("Nome da loja", "Store name", "Nombre de la tienda"),
    isRequired: true,
  },
  {
    type: "input",
    name: "tagline",
    dataType: EDataType.TEXT,
    label: tr("Slogan", "Tagline", "Eslogan"),
    maxLength: 120,
  },
  {
    type: "file",
    name: "logo",
    dataType: EDataType.FILE,
    label: tr("Logo", "Logo", "Logotipo"),
    validators: ["onlyImages"],
    storageConfig,
  },
  {
    type: "file",
    name: "favicon",
    dataType: EDataType.FILE,
    label: tr("Ícone da aba (favicon)", "Tab icon (favicon)", "Icono de la pestaña (favicon)"),
    validators: ["onlyImages"],
    storageConfig,
  },
];

export const visualElements: IFormElement[] = [
  {
    type: "input",
    name: "primaryColor",
    dataType: EDataType.COLOR,
    label: tr("Cor primária", "Primary color", "Color primario"),
  },
  {
    type: "input",
    name: "secondaryColor",
    dataType: EDataType.COLOR,
    label: tr("Cor secundária", "Secondary color", "Color secundario"),
  },
  {
    type: "input",
    name: "inkColor",
    dataType: EDataType.COLOR,
    label: tr("Cor escura (cabeçalho, rodapé e botões)", "Dark color (header, footer and buttons)", "Color oscuro (encabezado, pie y botones)"),
  },
  {
    type: "select",
    name: "font",
    dataType: EDataType.TEXT,
    label: tr("Fonte", "Font", "Fuente"),
    options: FONTS.map((font) => ({ label: font.label, value: font.value, isSelected: font.value === "inter" })),
  },
  {
    type: "select",
    name: "radius",
    dataType: EDataType.TEXT,
    label: tr("Arredondamento", "Corner style", "Redondeo"),
    options: RADII.map((radius) => ({ label: radius.label, value: radius.value, isSelected: radius.value === "soft" })),
  },
  {
    type: "input",
    name: "pageSize",
    dataType: EDataType.INTEGER,
    label: tr("Produtos por página", "Products per page", "Productos por página"),
    defaultValue: 12,
  },
];

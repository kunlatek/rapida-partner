import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import { tr } from "./translations";

const textInput = (name: string, label: ReturnType<typeof tr>): IFormElement => ({
  type: "input",
  name,
  dataType: EDataType.TEXT,
  label,
});

export const contactElements: IFormElement[] = [
  {
    type: "input",
    name: "whatsappNumber",
    dataType: EDataType.TEXT,
    label: tr("WhatsApp de vendas", "Sales WhatsApp", "WhatsApp de ventas"),
    tooltip: tr("Somente dígitos, com DDI (ex.: 5582999999999)", "Digits only, with country code (e.g. 5582999999999)", "Solo dígitos, con código de país (ej.: 5582999999999)"),
    validators: ["onlyNumbers"],
  },
  {
    type: "input",
    name: "phone",
    dataType: EDataType.TEXT,
    label: tr("Telefone", "Phone", "Teléfono"),
    validators: ["phone"],
  },
  {
    type: "input",
    name: "email",
    dataType: EDataType.EMAIL,
    label: tr("E-mail de contato", "Contact e-mail", "Correo de contacto"),
    validators: ["email"],
  },
  textInput("weekdayHours", tr("Horário em dias úteis", "Weekday hours", "Horario entre semana")),
  textInput("saturdayHours", tr("Horário no sábado", "Saturday hours", "Horario del sábado")),
];

export const legalElements: IFormElement[] = [
  textInput("companyName", tr("Razão social", "Legal name", "Razón social")),
  {
    type: "input",
    name: "cnpj",
    dataType: EDataType.TEXT,
    label: tr("CNPJ", "CNPJ", "CNPJ"),
    mask: "00.000.000/0000-00",
    validators: ["cnpj"],
  },
  textInput("address", tr("Endereço", "Address", "Dirección")),
];

export const socialElements: IFormElement[] = [
  textInput("instagramUrl", tr("Instagram (link)", "Instagram (link)", "Instagram (enlace)")),
  textInput("facebookUrl", tr("Facebook (link)", "Facebook (link)", "Facebook (enlace)")),
  textInput("tiktokUrl", tr("TikTok (link)", "TikTok (link)", "TikTok (enlace)")),
  textInput("youtubeUrl", tr("YouTube (link)", "YouTube (link)", "YouTube (enlace)")),
];

export interface IStyle {
  overall: {
    defaultStyleAttributes: IDefaultStyleAttributes;
  }[],
  main:  {
    defaultStyleAttributes: IDefaultStyleAttributes;
  }[],
  navBar?:  {
    defaultStyleAttributes: IDefaultStyleAttributes;
  }[],
  sideBar?:  {
    defaultStyleAttributes: IDefaultStyleAttributes;
  }[],
  footer?:  {
    defaultStyleAttributes: IDefaultStyleAttributes;
  }[],
}

interface IDefaultStyleAttributes {
  themeName: string,
  primaryColor?: string,
  contrastPrimaryColor?: string,
  secondaryColor?: string,
  contrastSecondaryColor?: string,
  tertiaryColor?: string,
  contrastTertiaryColor?: string,
  quaternaryColor?: string,
  contrastQuaternaryColor?: string,
  backgroundColor?: string,
  fontFamily?: string,
  borderRadius?: string,
  boxShadow?: string,
  spacing?: string,
  fontSize?: string,
  headerHeight?: string,
  footerHeight?: string,
  maxWidth?: string,
  // Forms
  inputBackgroundColor?: string,
  inputTextColor?: string,
  inputBorderColor?: string,
  inputBorderRadius?: string,
  inputFocusBorderColor?: string,
  inputPlaceholderColor?: string,
  buttonBackgroundColor?: string,
  buttonTextColor?: string,
  buttonBorderColor?: string,
  buttonBorderRadius?: string,
  buttonHoverBackgroundColor?: string,
  buttonHoverTextColor?: string,
  buttonHoverBorderColor?: string,
  buttonDisabledBackgroundColor?: string,
  buttonDisabledTextColor?: string,
  buttonDisabledBorderColor?: string,
  labelTextColor?: string,
  labelFontSize?: string,
  labelFontWeight?: string,
  fieldsetBorderColor?: string,
  fieldsetBorderRadius?: string,
  fieldsetLegendColor?: string,
  fieldsetLegendFontSize?: string,
  fieldsetLegendFontWeight?: string,
  errorColor?: string,
  successColor?: string,
  warningColor?: string,
  infoColor?: string,
  // Tables
}
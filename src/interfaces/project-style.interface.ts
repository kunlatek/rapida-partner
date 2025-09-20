/**
 * Defines the color palette for a theme.
 * Includes primary, secondary, tertiary, and status colors.
 */
interface IColorPalette {
  primary?: string;
  primaryContrast?: string;
  secondary?: string;
  secondaryContrast?: string;
  tertiary?: string;
  tertiaryContrast?: string;
  quaternary?: string;
  quaternaryContrast?: string;
  background?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
}

/**
 * Defines typography styles for a theme.
 */
interface ITypography {
  fontFamily?: string;
  fontSize?: string;
}

/**
 * Defines border styles for a theme.
 */
interface IBorders {
  radius?: string;
}

/**
 * Defines shadow styles for a theme.
 */
interface IShadows {
  boxShadow?: string;
}

/**
 * Defines styles for form input elements.
 */
interface IInputStyles {
  background?: string;
  text?: string;
  border?: string;
  borderRadius?: string;
  focusBorder?: string;
  placeholder?: string;
  width?: string;
}

/**
 * Defines styles for button elements.
 */
interface IButtonStyles {
  background?: string;
  text?: string;
  border?: string;
  borderRadius?: string;
  hoverBackground?: string;
  hoverText?: string;
  hoverBorder?: string;
  disabledBackground?: string;
  disabledText?: string;
  disabledBorder?: string;
}

/**
 * Defines styles for label elements.
 */
interface ILabelStyles {
  text?: string;
  fontSize?: string;
  fontWeight?: string;
}

/**
 * Defines styles for fieldset elements.
 */
interface IFieldsetStyles {
  border?: string;
  borderRadius?: string;
  legendText?: string;
  legendFontSize?: string;
  legendFontWeight?: string;
}

/**
 * Groups all component-specific styles.
 */
interface IComponentStyles {
  input?: IInputStyles;
  button?: IButtonStyles;
  label?: ILabelStyles;
  fieldset?: IFieldsetStyles;
}

/**
 * Represents a complete theme definition, combining palette, typography,
 * and component-specific styles.
 */
interface ITheme {
  colors?: IColorPalette;
  typography?: ITypography;
  borders?: IBorders;
  shadows?: IShadows;
  spacing?: string;
  maxWidth?: string;
  headerHeight?: string;
  footerHeight?: string;
  components?: IComponentStyles;
}

/**
 * Defines the style structure for the entire project, allowing for
 * different themes to be applied to different layout sections.
 */
export interface IStyle {
  themeName: string;
  overall?: ITheme;
  main?: ITheme;
  navBar?: ITheme;
  sideBar?: ITheme;
  footer?: ITheme;
}
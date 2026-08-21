/**
 * Defines the color palette for a theme.
 * Scope intentionally limited to the fields actually consumed today by
 * ThemeService.applyCustomTheme in rapida-code-generator — see
 * docs/architecture-review-2026-08-20.md, achado A/B.
 */
export interface IColorPalette {
  primary?: string;
  primaryContrast?: string;
  secondary?: string;
  secondaryContrast?: string;
  background?: string;
  error?: string;
  success?: string;
}

/**
 * Defines border styles for a theme.
 */
export interface IBorders {
  borderRadius?: string;
}

/**
 * Defines the style structure for the entire project.
 */
export interface IStyle {
  themeName: string;
  colors?: IColorPalette;
  borders?: IBorders;
}

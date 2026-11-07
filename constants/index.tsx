import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_CRECHE_API_URL ?? process.env.EXPO_PUBLIC_API_URL;

if (!configuredApiUrl && !__DEV__) {
  throw new Error('EXPO_PUBLIC_CRECHE_API_URL is required for production builds.');
}

export const API_URL = (configuredApiUrl ?? 'http://localhost:5080/api/v1').replace(/\/$/, '');

export const Colors = {
  primary: '#F2C94C',
  primaryDark: '#171713',
  primaryMid: '#D7A91E',
  goldDark: '#9B7100',
  primaryLight: '#FFF4C8',
  primaryLighter: '#FFFAE9',
  accent: '#F2C94C',
  accentLight: '#FFF4C8',
  ink: '#171713',
  inkSoft: '#292923',
  paper: '#FFFEFA',
  cream: '#F6F2E8',
  lilac: '#8C7AE6',
  lilacLight: '#EEEAFD',
  coral: '#FF806B',
  coralLight: '#FFE9E4',
  sky: '#66B8E5',
  skyLight: '#E5F4FC',
  mint: '#65C89A',
  mintLight: '#E3F6ED',
  info: '#66B8E5',
  infoLight: '#E5F4FC',
  background: '#F6F2E8',
  surface: '#FFFEFA',
  surfaceAlt: '#F0EDE4',
  border: '#DED9CB',
  textPrimary: '#171713',
  textSecondary: '#66665D',
  textMuted: '#96958B',
  textInverse: '#FFFEFA',
  error: '#C94D48',
  errorLight: '#FBE9E7',
  warning: '#F2C94C',
  success: '#318765',
  successLight: '#E3F6ED',
  shadow: 'rgba(23,23,19,0.08)',
  shadowDark: 'rgba(23,23,19,0.18)',
  overlay: 'rgba(23,23,19,0.58)',
};

export const Typography = {
  display: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', web: 'Avenir Next, Segoe UI, sans-serif' }),
  body: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', web: 'Avenir Next, Segoe UI, sans-serif' }),
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const Radius = { sm: 8, md: 12, lg: 18, xl: 28, full: 9999 };
export const FontSize = { xs: 11, sm: 13, md: 15, lg: 17, xl: 21, xxl: 26, xxxl: 32, display: 42 };
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const colors = {
  primary: '#0F3460',
  accent: '#E94560',
  surface: '#FFFFFF',
  background: '#F5F6FA',
  card: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E5E7EB',
  divider: '#F3F4F6',
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '600' as const, color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

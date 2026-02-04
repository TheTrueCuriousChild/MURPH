export const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceDark: '#1F2937',
  text: '#111827',
  textLight: '#6B7280',
  textWhite: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardGradient1: '#667EEA',
  cardGradient2: '#764BA2',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  body1: {
    fontSize: 15,
    color: colors.text,
  },
  body2: {
    fontSize: 13,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 100,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

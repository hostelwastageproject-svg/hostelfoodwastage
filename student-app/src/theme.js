import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#2E7D32',
  secondary: '#66BB6A',
  background: '#F5F7FA',
  textPrimary: '#1A1A1A',
  textSecondary: '#64748B',
  error: '#E53935',
  warning: '#F9A825',
  white: '#FFFFFF',
  lightGreen: 'rgba(102, 187, 106, 0.1)',
  border: '#E2E8F0',
};

// Common constraints: 12px radius, 16px basic padding, soft shadows
export const SIZES = {
  radius: 12,
  padding: 16,
  baseFont: 16,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  }
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.baseFont,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    fontSize: SIZES.baseFont,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.soft,
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.baseFont,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginBottom: 24,
  }
});

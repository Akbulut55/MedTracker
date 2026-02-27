import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, CONTROL, RADIUS, TYPOGRAPHY } from '../../app/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
};

export function AppButton({ title, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variant === 'danger' && styles.danger, variant === 'secondary' && styles.secondary, disabled && styles.disabled]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.brand,
    minHeight: CONTROL.height,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: { backgroundColor: COLORS.danger },
  secondary: { backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border },
  disabled: { opacity: 0.6 },
  text: { color: 'white', fontWeight: '900', fontSize: TYPOGRAPHY.subtitle },
  secondaryText: { color: COLORS.text },
});

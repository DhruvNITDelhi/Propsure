import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon = 'information-outline',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={48}
          color={colors.textMuted}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
});

export default React.memo(EmptyState);

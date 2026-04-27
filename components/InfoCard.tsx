import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

interface InfoCardProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  iconColor = colors.primary,
  title,
  subtitle,
  children,
  onPress,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '1A' }]}>
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={22}
            color={iconColor}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>}
        </View>
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  content: {
    marginTop: spacing.sm + 4,
  },
});

export default React.memo(InfoCard);

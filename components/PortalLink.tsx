import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';

interface PortalLinkProps {
  url: string;
  label: string;
  description?: string;
}

const PortalLink: React.FC<PortalLinkProps> = ({ url, label, description }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/browser',
      params: { url, title: label }
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="open-in-new" size={20} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <Text style={styles.hint}>Opens in app</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '08',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    padding: spacing.md,
    gap: spacing.sm + 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.h3,
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    marginTop: 2,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default React.memo(PortalLink);

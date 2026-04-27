import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import ScreenHeader from '../../components/ScreenHeader';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Settings" showBack />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>App Name</Text>
              <Text style={styles.aboutValue}>PropSure</Text>
            </View>
            <View style={styles.aboutDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.aboutDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Platform</Text>
              <Text style={styles.aboutValue}>Android</Text>
            </View>
          </View>
          <Text style={styles.disclaimerText}>
            PropSure provides general information about Indian real estate processes. This app does not constitute legal advice. Always consult a qualified legal professional for property transactions.
          </Text>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
          </View>
          <View style={styles.privacyCard}>
            <View style={styles.privacyItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.success} />
              <Text style={styles.privacyText}>All data is stored locally on your device</Text>
            </View>
            <View style={styles.privacyItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.success} />
              <Text style={styles.privacyText}>We do not collect any personal information</Text>
            </View>
            <View style={styles.privacyItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.success} />
              <Text style={styles.privacyText}>No external API calls are made</Text>
            </View>
            <View style={styles.privacyItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.success} />
              <Text style={styles.privacyText}>No analytics or crash reporting without consent</Text>
            </View>
          </View>
          <Text style={styles.privacyLink}>
            Privacy policy available at [your-website]/privacy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
  },
  sectionInfo: {
    ...typography.caption,
    lineHeight: 18,
    marginBottom: spacing.md,
  },

  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  aboutLabel: {
    ...typography.label,
  },
  aboutValue: {
    ...typography.body,
    fontWeight: '500',
  },
  aboutDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  disclaimerText: {
    ...typography.caption,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  privacyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  privacyText: {
    ...typography.body,
    flex: 1,
  },
  privacyLink: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

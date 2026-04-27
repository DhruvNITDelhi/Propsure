import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import StateSelector from '../components/StateSelector';

type FeatureItem = {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
};

const features: FeatureItem[] = [
  {
    title: 'RERA Check',
    subtitle: 'Verify builder & project registration',
    icon: 'shield-check',
    route: '/rera',
  },
  {
    title: 'Land Records',
    subtitle: 'Search by survey or khasra number',
    icon: 'map-search',
    route: '/land',
  },
  {
    title: 'Mutation Guide',
    subtitle: 'Step-by-step transfer of name',
    icon: 'file-document-edit',
    route: '/mutation',
  },
  {
    title: 'Rent Agreement',
    subtitle: 'Instant legal agreement',
    icon: 'file-sign',
    route: '/rental',
  },
  {
    title: 'Stamp Duty Calc',
    subtitle: 'Registration cost estimator',
    icon: 'calculator',
    route: '/stamp',
  },
  {
    title: 'Settings',
    subtitle: 'App info & privacy',
    icon: 'cog',
    route: '/settings',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="shield-home" size={28} color={colors.surface} />
            </View>
            <View>
              <Text style={styles.appName}>PropSure</Text>
              <Text style={styles.tagline}>India's Property Companion</Text>
            </View>
          </View>
        </View>

        {/* State Selector */}
        <View style={styles.stateSection}>
          <StateSelector
            value={selectedState}
            onChange={setSelectedState}
            label="Your State"
          />
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.route}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.featureIconContainer}>
                <MaterialCommunityIcons
                  name={feature.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <MaterialCommunityIcons name="information-outline" size={14} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>
            Always consult a legal professional for property transactions.
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
    paddingBottom: spacing.xl,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.surface,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  stateSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 4,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  featureTitle: {
    ...typography.h3,
    marginBottom: 2,
  },
  featureSubtitle: {
    ...typography.caption,
    lineHeight: 16,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

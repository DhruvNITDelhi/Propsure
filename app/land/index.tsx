import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { landPortals } from '../../constants/landData';
import ScreenHeader from '../../components/ScreenHeader';
import StateSelector from '../../components/StateSelector';
import PortalLink from '../../components/PortalLink';
import EmptyState from '../../components/EmptyState';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const howToReadSections = [
  {
    title: 'Khatauni / Record of Rights (RoR)',
    content: 'The Khatauni or RoR is the primary land ownership document maintained by the state revenue department. It lists the current owner, survey number, land area, and type of land (agricultural, residential, etc.). Always verify that the seller\'s name matches exactly.',
  },
  {
    title: 'Khasra Number',
    content: 'A khasra number is a unique plot/survey number assigned to each piece of land in the village or town records. It helps identify the exact location of the property. Different states use different terms: survey number, dag number, or gat number.',
  },
  {
    title: 'Jamabandi',
    content: 'Jamabandi is the record of rights maintained in states like Haryana, Punjab, and Rajasthan. It contains details about ownership, cultivation, soil type, and revenue. The most recent jamabandi entry should match the current owner\'s details.',
  },
  {
    title: 'Encumbrance / Mutation Status',
    content: '"Dakhil Kharij" means mutation has been completed — the property has been transferred to the new owner\'s name in revenue records. An encumbrance certificate (EC) confirms whether the property has any pending loans, mortgages, or legal disputes.',
  },
];

const commonProblems = [
  {
    title: 'Disputed Ownership',
    description: 'If multiple parties claim ownership, check the latest mutation record, EC certificate (15 years), and any pending court cases. Hire a property lawyer before proceeding.',
    icon: 'account-alert',
    color: colors.danger,
  },
  {
    title: 'Multiple Claimants',
    description: 'Common in inherited properties. Verify the succession certificate or family partition deed. All legal heirs must consent to the sale.',
    icon: 'account-group',
    color: colors.warning,
  },
  {
    title: 'Missing Records',
    description: 'If land records are not digitized or are missing, approach the Tehsildar / Taluk office with an application. You may need to get a surveyor to re-survey the land.',
    icon: 'file-alert',
    color: colors.accent,
  },
];

export default function LandRecordsScreen() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState('');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const portal = selectedState ? landPortals[selectedState] : null;

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Land Records" subtitle="Search property ownership records" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Guided Search Hero CTA ── */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => router.push('/land/find')}
          activeOpacity={0.85}
        >
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name="compass" size={28} color={colors.surface} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Don't know where to start?</Text>
            <Text style={styles.heroSubtitle}>
              Use our guided search — drop a pin on the map, no Gata number or documents needed
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.surface} />
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or search manually</Text>
          <View style={styles.orLine} />
        </View>

        <StateSelector
          value={selectedState}
          onChange={setSelectedState}
          label="Select State"
        />

        {!selectedState ? (
          <EmptyState
            title="Select a state to begin"
            subtitle="Choose your state to find the official land records portal and guidance"
            icon="map-search"
          />
        ) : (
          <>
            {/* Portal Info */}
            {portal ? (
              <View style={styles.portalCard}>
                <View style={styles.portalHeader}>
                  <MaterialCommunityIcons name="database-search" size={20} color={colors.primary} />
                  <Text style={styles.portalName}>{portal.name}</Text>
                </View>
                <Text style={styles.portalSearchBy}>
                  Search by: {portal.searchBy}
                </Text>
                <Text style={styles.portalInfo}>
                  You can search for owner details, survey/khasra numbers, khatauni, jamabandi, and encumbrance status on this portal.
                </Text>
                <PortalLink
                  url={portal.url}
                  label={`Open ${portal.name}`}
                  description="Search land records on the official portal"
                />
              </View>
            ) : (
              <View style={styles.noPortalCard}>
                <MaterialCommunityIcons name="information-outline" size={24} color={colors.warning} />
                <Text style={styles.noPortalText}>
                  Land records portal for {selectedState} is not yet in our database. Please check the state revenue department website.
                </Text>
              </View>
            )}

            {/* What you need */}
            <View style={styles.needCard}>
              <Text style={styles.sectionTitle}>What You Need Before Searching</Text>
              {[
                { icon: 'numeric', text: 'Khasra / Survey number (if known)' },
                { icon: 'map-marker', text: 'District, Tehsil, Village name' },
                { icon: 'account', text: 'Owner name (optional but helpful)' },
              ].map((item, i) => (
                <View key={i} style={styles.needItem}>
                  <MaterialCommunityIcons name={item.icon as any} size={18} color={colors.primary} />
                  <Text style={styles.needText}>{item.text}</Text>
                </View>
              ))}
            </View>

            {/* How to read */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How to Read Your Land Record</Text>
              {howToReadSections.map((section, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.accordion}
                  onPress={() => toggleSection(index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.accordionHeader}>
                    <Text style={styles.accordionTitle}>{section.title}</Text>
                    <MaterialCommunityIcons
                      name={expandedSection === index ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                  {expandedSection === index && (
                    <Text style={styles.accordionContent}>{section.content}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Common Problems */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Common Problems</Text>
              {commonProblems.map((problem, index) => (
                <View key={index} style={styles.problemCard}>
                  <View style={[styles.problemIconContainer, { backgroundColor: problem.color + '14' }]}>
                    <MaterialCommunityIcons
                      name={problem.icon as any}
                      size={22}
                      color={problem.color}
                    />
                  </View>
                  <View style={styles.problemText}>
                    <Text style={styles.problemTitle}>{problem.title}</Text>
                    <Text style={styles.problemDescription}>{problem.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
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
  portalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  portalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  portalName: {
    ...typography.h2,
    color: colors.primary,
  },
  portalSearchBy: {
    ...typography.label,
    backgroundColor: colors.primary + '0D',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  portalInfo: {
    ...typography.caption,
    lineHeight: 18,
  },
  noPortalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning + '10',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  noPortalText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  needCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  needItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  needText: {
    ...typography.body,
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm + 2,
  },
  accordion: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  accordionContent: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm + 2,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  problemCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    gap: spacing.sm + 2,
  },
  problemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemText: {
    flex: 1,
  },
  problemTitle: {
    ...typography.h3,
    marginBottom: 4,
  },
  problemDescription: {
    ...typography.caption,
    lineHeight: 17,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

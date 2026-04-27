import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { reraPortals } from '../../constants/reraData';
import ScreenHeader from '../../components/ScreenHeader';
import StateSelector from '../../components/StateSelector';
import PortalLink from '../../components/PortalLink';
import EmptyState from '../../components/EmptyState';
import { generateAndSharePdf, wrapInHtmlTemplate } from '../../utils/pdf';

const checklistItems = [
  'Project registration number is valid and active',
  'Promoter/builder is listed and not blacklisted',
  'Completion date matches what builder claims',
  'Quarterly progress reports are being filed',
  'Land title documents are uploaded',
  'Carpet area matches what you are being sold',
];

const redFlags = [
  'Builder asks you to pay more than 10% before RERA registration',
  'No RERA registration number is provided or number seems invalid',
  'Builder refuses to share quarterly progress reports',
  'Advertised area is "super built-up" but RERA mandates carpet area only',
];

export default function RERAScreen() {
  const [selectedState, setSelectedState] = useState('');

  const portal = selectedState ? reraPortals[selectedState] : null;
  const hasPortal = !!portal;

  const handleSavePdf = async () => {
    let html = '<h1>RERA Verification Checklist</h1>';
    if (selectedState) {
      html += `<p><strong>State:</strong> ${selectedState}</p>`;
      if (portal) {
        html += `<p><strong>Portal:</strong> ${portal.name} — ${portal.url}</p>`;
      }
    }
    html += '<h2>What to Check on the RERA Portal</h2>';
    html += '<ol>';
    for (const item of checklistItems) {
      html += `<li>${item}</li>`;
    }
    html += '</ol>';
    html += '<h2>Red Flags to Watch For</h2>';
    html += '<ul>';
    for (const flag of redFlags) {
      html += `<li class="warning">${flag}</li>`;
    }
    html += '</ul>';

    await generateAndSharePdf(
      wrapInHtmlTemplate(html, 'RERA Checklist - PropSure'),
      'RERA_Checklist'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="RERA Checker" subtitle="Verify project & builder registration" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StateSelector
          value={selectedState}
          onChange={setSelectedState}
          label="Select State"
        />

        {!selectedState ? (
          <EmptyState
            title="Select a state to begin"
            subtitle="Choose your state to find the official RERA portal and verification checklist"
            icon="shield-search"
          />
        ) : (
          <>
            {/* Portal Info Card */}
            <View style={styles.portalCard}>
              {hasPortal ? (
                <>
                  <View style={styles.portalBadge}>
                    <MaterialCommunityIcons name="shield-check" size={20} color={colors.success} />
                    <Text style={styles.portalName}>{portal.name}</Text>
                  </View>
                  <Text style={styles.portalNotes}>{portal.notes}</Text>
                  <Text style={styles.portalExplainer}>
                    RERA registration ensures that the builder has submitted all project details, land titles, and financial plans to the regulatory authority. It protects buyers from delays, defects, and fraud.
                  </Text>
                  <View style={styles.portalLinkWrapper}>
                    <PortalLink
                      url={portal.url}
                      label={`Open ${portal.name} Portal`}
                      description="Verify project registration on the official portal"
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noPortal}>
                  <MaterialCommunityIcons name="information-outline" size={24} color={colors.warning} />
                  <Text style={styles.noPortalText}>
                    RERA portal for {selectedState} is not yet active or we are updating the link. Please check the state government website.
                  </Text>
                </View>
              )}
            </View>

            {/* What to Check */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What to Check on the RERA Portal</Text>
              {checklistItems.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <View style={styles.checkNumber}>
                    <Text style={styles.checkNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.checklistText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Red Flags */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.danger }]}>
                Red Flags to Watch For
              </Text>
              {redFlags.map((flag, index) => (
                <View key={index} style={styles.redFlagItem}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={colors.danger} />
                  <Text style={styles.redFlagText}>{flag}</Text>
                </View>
              ))}
            </View>

            {/* Save as PDF */}
            <TouchableOpacity style={styles.pdfButton} onPress={handleSavePdf} activeOpacity={0.7}>
              <MaterialCommunityIcons name="file-pdf-box" size={20} color={colors.surface} />
              <Text style={styles.pdfButtonText}>Save Checklist as PDF</Text>
            </TouchableOpacity>
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
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  portalName: {
    ...typography.h2,
    color: colors.primary,
  },
  portalNotes: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  portalExplainer: {
    ...typography.caption,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  portalLinkWrapper: {
    marginTop: spacing.xs,
  },
  noPortal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  noPortalText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm + 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm + 2,
  },
  checkNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  checklistText: {
    ...typography.body,
    flex: 1,
    lineHeight: 20,
  },
  redFlagItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
    backgroundColor: colors.danger + '08',
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
  },
  redFlagText: {
    ...typography.body,
    flex: 1,
    color: colors.danger,
    lineHeight: 20,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  pdfButtonText: {
    ...typography.h3,
    color: colors.surface,
  },
});

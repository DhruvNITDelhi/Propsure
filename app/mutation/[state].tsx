import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { mutationGuides } from '../../constants/mutationData';
import ScreenHeader from '../../components/ScreenHeader';
import PortalLink from '../../components/PortalLink';
import EmptyState from '../../components/EmptyState';
import { generateAndSharePdf, wrapInHtmlTemplate } from '../../utils/pdf';

export default function MutationStateScreen() {
  const { state } = useLocalSearchParams<{ state: string }>();
  const decodedState = decodeURIComponent(state || '');
  const guide = decodedState ? mutationGuides[decodedState] : null;
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSavePdf = async () => {
    if (!guide) return;
    let html = `<h1>Mutation Guide — ${decodedState}</h1>`;
    html += `<div class="section">`;
    html += `<p><strong>Local Name:</strong> ${guide.localName}</p>`;
    html += `<p><strong>Department:</strong> ${guide.department}</p>`;
    html += `<p><strong>Timeline:</strong> ${guide.timeline}</p>`;
    html += `<p><strong>Fee:</strong> ${guide.feeRange}</p>`;
    html += `</div>`;

    html += '<h2>Documents Required</h2><ul>';
    for (const doc of guide.documents) {
      html += `<li>${doc}</li>`;
    }
    html += '</ul>';

    html += '<h2>Steps</h2><ol>';
    for (const step of guide.steps) {
      html += `<li><strong>${step.title}</strong><br>${step.detail}</li>`;
    }
    html += '</ol>';

    html += '<h2>Tips to Avoid Rejection</h2><ul>';
    for (const tip of guide.rejectionTips) {
      html += `<li>${tip}</li>`;
    }
    html += '</ul>';

    await generateAndSharePdf(
      wrapInHtmlTemplate(html, `Mutation Guide - ${decodedState}`),
      `Mutation_Guide_${decodedState.replace(/\s/g, '_')}`
    );
  };

  if (!guide) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title={decodedState || 'Mutation Guide'} showBack />
        <EmptyState
          title="Data coming soon"
          subtitle={`Mutation guide for ${decodedState} is being updated. Please check back in a future update.`}
          icon="file-document-edit-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={decodedState} subtitle="Mutation Guide" showBack />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Local Name</Text>
            <Text style={styles.overviewValue}>{guide.localName}</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Department</Text>
            <Text style={styles.overviewValue}>{guide.department}</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Timeline</Text>
            <View style={styles.timelineBadge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={colors.primary} />
              <Text style={styles.timelineText}>{guide.timeline}</Text>
            </View>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Fee Range</Text>
            <Text style={styles.overviewValue}>{guide.feeRange}</Text>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents Required</Text>
          <Text style={styles.sectionHint}>Tap to check off items as you collect them</Text>
          {guide.documents.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={styles.docItem}
              onPress={() => toggleDoc(index)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={checkedDocs[index] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={checkedDocs[index] ? colors.success : colors.textMuted}
              />
              <Text
                style={[
                  styles.docText,
                  checkedDocs[index] && styles.docChecked,
                ]}
              >
                {doc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step-by-Step Process</Text>
          {guide.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumberContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                {index < guide.steps.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDetail}>{step.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Online Portal */}
        {guide.onlinePortal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Online Mutation</Text>
            <PortalLink
              url={guide.onlinePortal}
              label="Apply Online"
              description="Start your mutation application on the official portal"
            />
          </View>
        )}

        {/* Rejection Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Rejections & How to Avoid Them</Text>
          {guide.rejectionTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={colors.warning} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Save PDF */}
        <TouchableOpacity style={styles.pdfButton} onPress={handleSavePdf} activeOpacity={0.7}>
          <MaterialCommunityIcons name="file-pdf-box" size={20} color={colors.surface} />
          <Text style={styles.pdfButtonText}>Save as PDF</Text>
        </TouchableOpacity>
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
  overviewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  overviewLabel: {
    ...typography.label,
    width: 100,
  },
  overviewValue: {
    ...typography.body,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  overviewDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  timelineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '0D',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  timelineText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.caption,
    marginBottom: spacing.sm + 2,
    fontStyle: 'italic',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  docText: {
    ...typography.body,
    flex: 1,
    lineHeight: 20,
  },
  docChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  stepNumberContainer: {
    alignItems: 'center',
    width: 32,
    marginRight: spacing.sm + 2,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.primary + '30',
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    ...typography.h3,
    marginBottom: 4,
  },
  stepDetail: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warning + '0A',
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
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

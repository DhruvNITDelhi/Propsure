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
import { mutationGuides } from '../../constants/mutationData';
import ScreenHeader from '../../components/ScreenHeader';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const topStates = [
  'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Delhi', 'Tamil Nadu',
  'Gujarat', 'Rajasthan', 'West Bengal', 'Haryana', 'Telangana',
];

export default function MutationIndexScreen() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const allStates = Object.keys(mutationGuides);
  const otherStates = allStates.filter((s) => !topStates.includes(s));

  const toggleShowAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(!showAll);
  };

  const navigateToState = (state: string) => {
    router.push(`/mutation/${encodeURIComponent(state)}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Property Mutation Guide" subtitle="Transfer property records to your name" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={22} color={colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>What is Property Mutation?</Text>
            <Text style={styles.infoText}>
              Mutation (also called Dakhil Kharij, Ferfar, Khata Transfer, or Namjamin in different states) is the process of updating government land/revenue records to reflect the new owner's name after a property purchase, inheritance, or gift. It is essential for paying property tax and establishing ownership.
            </Text>
          </View>
        </View>

        {/* State Cards */}
        <Text style={styles.sectionTitle}>Select Your State</Text>
        <View style={styles.stateGrid}>
          {topStates.map((state) => {
            const guide = mutationGuides[state];
            return (
              <TouchableOpacity
                key={state}
                style={styles.stateCard}
                onPress={() => navigateToState(state)}
                activeOpacity={0.7}
              >
                <View style={styles.stateCardHeader}>
                  <MaterialCommunityIcons name="map-marker" size={18} color={colors.primary} />
                  <Text style={styles.stateName}>{state}</Text>
                </View>
                {guide && (
                  <View style={styles.stateCardMeta}>
                    <MaterialCommunityIcons name="clock-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.stateTimeline}>{guide.timeline}</Text>
                  </View>
                )}
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={colors.textMuted}
                  style={styles.stateChevron}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Show All Toggle */}
        {otherStates.length > 0 && (
          <>
            <TouchableOpacity style={styles.showAllButton} onPress={toggleShowAll} activeOpacity={0.7}>
              <Text style={styles.showAllText}>
                {showAll ? 'Hide other states' : `Show all states (${otherStates.length} more)`}
              </Text>
              <MaterialCommunityIcons
                name={showAll ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>

            {showAll && (
              <View style={styles.stateGrid}>
                {otherStates.map((state) => {
                  const guide = mutationGuides[state];
                  return (
                    <TouchableOpacity
                      key={state}
                      style={styles.stateCard}
                      onPress={() => navigateToState(state)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.stateCardHeader}>
                        <MaterialCommunityIcons name="map-marker" size={18} color={colors.primary} />
                        <Text style={styles.stateName}>{state}</Text>
                      </View>
                      {guide && (
                        <View style={styles.stateCardMeta}>
                          <MaterialCommunityIcons name="clock-outline" size={13} color={colors.textMuted} />
                          <Text style={styles.stateTimeline}>{guide.timeline}</Text>
                        </View>
                      )}
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color={colors.textMuted}
                        style={styles.stateChevron}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '0A',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    padding: spacing.md,
    gap: spacing.sm + 2,
    marginBottom: spacing.lg,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm + 2,
  },
  stateGrid: {
    gap: spacing.sm,
  },
  stateCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  stateName: {
    ...typography.body,
    fontWeight: '600',
  },
  stateCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: spacing.sm,
  },
  stateTimeline: {
    ...typography.caption,
    fontSize: 11,
  },
  stateChevron: {
    marginLeft: 'auto',
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  showAllText: {
    ...typography.label,
    color: colors.primary,
  },
});
